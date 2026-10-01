package services

import (
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"porto-cercado-backend/models"
)

type googleNewsFeed struct {
	Channel struct {
		Items []struct {
			Title   string `xml:"title"`
			Link    string `xml:"link"`
			PubDate string `xml:"pubDate"`
		} `xml:"item"`
	} `xml:"channel"`
}

// FetchFishingNews reúne manchetes recentes que servem somente como contexto editorial.
func FetchFishingNews() []models.AINewsSource {
	queries := []string{
		"site:gov.br pesca Pantanal Mato Grosso",
		"site:gov.br pescadores Mato Grosso meio ambiente",
		"pesca sustentável pescadores organizações internacionais",
	}
	client := &http.Client{Timeout: 8 * time.Second}
	seen := map[string]bool{}
	var sources []models.AINewsSource

	for _, query := range queries {
		endpoint := "https://news.google.com/rss/search?q=" + url.QueryEscape(query) + "&hl=pt-BR&gl=BR&ceid=BR:pt-419"
		response, err := client.Get(endpoint)
		if err != nil {
			continue
		}
		body, readErr := io.ReadAll(io.LimitReader(response.Body, 512*1024))
		response.Body.Close()
		if readErr != nil || response.StatusCode != http.StatusOK {
			continue
		}

		var feed googleNewsFeed
		if xml.Unmarshal(body, &feed) != nil {
			continue
		}
		for _, item := range feed.Channel.Items {
			title := strings.TrimSpace(item.Title)
			if title == "" || seen[title] || isIrrelevantForAssociation(title) {
				continue
			}
			seen[title] = true
			sources = append(sources, models.AINewsSource{Title: title, URL: item.Link, PublishedAt: item.PubDate})
			if len(sources) == 6 {
				return sources
			}
		}
	}
	return sources
}

func isIrrelevantForAssociation(title string) bool {
	lower := strings.ToLower(title)
	blockedTerms := []string{"celebridade", "famoso", "famosos", "leonardo", "celso portiolli", "sunga", "novela", "ator", "cantor", "músico", "padre para"}
	for _, term := range blockedTerms {
		if strings.Contains(lower, term) {
			return true
		}
	}
	relevantTerms := []string{"sema", "ibama", "pesca", "pescador", "pantanal", "rio", "ambient", "clima", "hidro", "defesa civil", "resíduo", "sustent"}
	for _, term := range relevantTerms {
		if strings.Contains(lower, term) {
			return false
		}
	}
	return true
}

func FormatNewsContext(sources []models.AINewsSource) string {
	if len(sources) == 0 {
		return "Nenhuma manchete recente foi encontrada neste momento."
	}
	var lines []string
	for index, source := range sources {
		lines = append(lines, fmt.Sprintf("%d. %s (%s) — %s", index+1, source.Title, source.PublishedAt, source.URL))
	}
	return strings.Join(lines, "\n")
}
