package models

type Article struct {
	ID            string   `json:"id"`
	Slug          string   `json:"slug"`
	Title         string   `json:"title"`
	Subtitle      string   `json:"subtitle,omitempty"`
	Summary       string   `json:"summary"`
	Content       []string `json:"content"`
	Category      string   `json:"category"`
	CategoryColor string   `json:"categoryColor"`
	Tag           string   `json:"tag,omitempty"`
	ImageURL      string   `json:"imageUrl"`
	Author        Author   `json:"author"`
	Date          string   `json:"date"`
	ReadTime      string   `json:"readTime"`
	Featured      bool     `json:"featured,omitempty"`
	Shares        int      `json:"shares,omitempty"`
}

type Author struct {
	Name     string `json:"name"`
	Role     string `json:"role"`
	Initials string `json:"initials"`
}

type VideoEpisode struct {
	ID            string `json:"id"`
	Title         string `json:"title"`
	Category      string `json:"category"`
	CategoryColor string `json:"categoryColor"`
	Duration      string `json:"duration"`
	Published     string `json:"published"`
	ImageURL      string `json:"imageUrl"`
	Presenter     string `json:"presenter,omitempty"`
	Description   string `json:"description,omitempty"`
	VideoURL      string `json:"videoUrl,omitempty"`
}

type PhotoAlbum struct {
	ID          string      `json:"id"`
	Title       string      `json:"title"`
	Category    string      `json:"category"`
	PhotoCount  int         `json:"photoCount"`
	CoverURL    string      `json:"coverUrl"`
	Date        string      `json:"date"`
	Location    string      `json:"location"`
	Description string      `json:"description"`
	Photos      []PhotoItem `json:"photos"`
}

type PhotoItem struct {
	URL     string `json:"url"`
	Caption string `json:"caption"`
}

type OfficialDocument struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Code        string `json:"code"`
	Type        string `json:"type"`
	Date        string `json:"date"`
	Size        string `json:"size"`
	Status      string `json:"status"`
	Summary     string `json:"summary"`
	Description string `json:"description,omitempty"`
	Category    string `json:"category,omitempty"`
	DownloadURL string `json:"downloadUrl"`
}

type CalendarEvent struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Day         string `json:"day"`
	Month       string `json:"month"`
	Year        string `json:"year"`
	Time        string `json:"time"`
	Modality    string `json:"modality"`
	Location    string `json:"location"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Registered  bool   `json:"registered,omitempty"`
}

type MemberProfile struct {
	Name               string `json:"name"`
	RegistrationNumber string `json:"registrationNumber"`
	Category           string `json:"category"`
	Section            string `json:"section"`
	Status             string `json:"status"`
	SinceYear          string `json:"sinceYear"`
	ValidThrough       string `json:"validThrough"`
	CPFMasked          string `json:"cpfMasked"`
}

type ArticleComment struct {
	ID          string `json:"id"`
	ArticleSlug string `json:"articleSlug"`
	AuthorName  string `json:"authorName"`
	AuthorEmail string `json:"authorEmail"`
	AuthorRole  string `json:"authorRole,omitempty"`
	IsPremium   bool   `json:"isPremium"`
	Content     string `json:"content"`
	CreatedAt   string `json:"createdAt"`
	Likes       int    `json:"likes"`
	LikedByMe   bool   `json:"likedByMe,omitempty"`
}

type AIChatRequest struct {
	Prompt  string `json:"prompt"`
	Context string `json:"context,omitempty"`
}

type AIChatResponse struct {
	Reply     string `json:"reply"`
	Timestamp string `json:"timestamp"`
}
