package models

import (
	"time"

	"gorm.io/gorm"
)

type UserRole string

const (
	RoleAdmin UserRole = "admin"
	RoleSuper UserRole = "super"
)

// User - Tabela exclusiva para Usuários Administrativos (Gestores e Super Admins)
type User struct {
	ID              uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Name            string         `gorm:"type:varchar(255);not null" json:"name"`
	Email           string         `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	Role            UserRole       `gorm:"type:varchar(50);not null;default:'admin'" json:"role"`
	EmailVerifiedAt *time.Time     `json:"emailVerifiedAt,omitempty"`
	Password        string         `gorm:"type:varchar(255);not null" json:"-"`
	Ativo           bool           `gorm:"default:true" json:"ativo"`
	RememberToken   *string        `gorm:"type:varchar(100)" json:"rememberToken,omitempty"`
	CreatedAt       time.Time      `json:"createdAt"`
	UpdatedAt       time.Time      `json:"updatedAt"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

// Subscriber - Tabela de Assinantes para publicação de comentários
type Subscriber struct {
	ID        uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string         `gorm:"type:varchar(255);not null" json:"name"`
	Email     string         `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	Ativo     bool           `gorm:"default:true" json:"ativo"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

// SiteSetting - Tabela de Gerenciamento de Informação do Site (CMS) baseada na tabela `sites` do backup.sql
type SiteSetting struct {
	ID              uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Title           string    `gorm:"type:varchar(255)" json:"title"`
	HeroTitle       string    `gorm:"type:varchar(255)" json:"heroTitle"`
	HeroSubtitle    string    `gorm:"type:text" json:"heroSubtitle"`
	HeroImage       string    `gorm:"type:varchar(255)" json:"heroImage"`
	Logo            string    `gorm:"type:varchar(255)" json:"logo"`
	StatsAssociados string    `gorm:"type:varchar(255)" json:"statsAssociados"`
	StatsHistorico  string    `gorm:"type:varchar(255)" json:"statsHistorico"`
	FooterText      string    `gorm:"type:text" json:"footerText"`
	Address         string    `gorm:"type:varchar(255)" json:"address"`
	Phone           string    `gorm:"type:varchar(255)" json:"phone"`
	Whatsapp        string    `gorm:"type:varchar(255)" json:"whatsapp"`
	Email           string    `gorm:"type:varchar(255)" json:"email"`
	CNPJ            string    `gorm:"type:varchar(255)" json:"cnpj"`
	Facebook        string    `gorm:"type:varchar(255)" json:"facebook"`
	Instagram       string    `gorm:"type:varchar(255)" json:"instagram"`
	AboutTitle      string    `gorm:"type:varchar(255)" json:"aboutTitle"`
	AboutContent    string    `gorm:"type:text" json:"aboutContent"`
	Benefit1Title   string    `gorm:"type:varchar(255)" json:"benefit1Title"`
	Benefit1Desc    string    `gorm:"type:varchar(255)" json:"benefit1Desc"`
	Benefit1Icon    string    `gorm:"type:varchar(255)" json:"benefit1Icon"`
	Benefit2Title   string    `gorm:"type:varchar(255)" json:"benefit2Title"`
	Benefit2Desc    string    `gorm:"type:varchar(255)" json:"benefit2Desc"`
	Benefit2Icon    string    `gorm:"type:varchar(255)" json:"benefit2Icon"`
	Benefit3Title   string    `gorm:"type:varchar(255)" json:"benefit3Title"`
	Benefit3Desc    string    `gorm:"type:varchar(255)" json:"benefit3Desc"`
	Benefit3Icon    string    `gorm:"type:varchar(255)" json:"benefit3Icon"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

// Article - CMS Notícias e Artigos
type Article struct {
	ID            uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Slug          string         `gorm:"type:varchar(255);uniqueIndex;not null" json:"slug"`
	Title         string         `gorm:"type:varchar(255);not null" json:"title"`
	Subtitle      string         `gorm:"type:varchar(255)" json:"subtitle,omitempty"`
	Summary       string         `gorm:"type:text" json:"summary"`
	Content       string         `gorm:"type:text" json:"content"`
	Category      string         `gorm:"type:varchar(100)" json:"category"`
	CategoryColor string         `gorm:"type:varchar(100)" json:"categoryColor"`
	Tag           string         `gorm:"type:varchar(100)" json:"tag,omitempty"`
	ImageURL      string         `gorm:"type:varchar(255)" json:"imageUrl"`
	VideoURL      string         `gorm:"type:varchar(255)" json:"videoUrl,omitempty"`
	AuthorName    string         `gorm:"type:varchar(255)" json:"authorName"`
	AuthorRole    string         `gorm:"type:varchar(255)" json:"authorRole"`
	AuthorInit    string         `gorm:"type:varchar(10)" json:"authorInit"`
	Date          string         `gorm:"type:varchar(100)" json:"date"`
	ReadTime      string         `gorm:"type:varchar(50)" json:"readTime"`
	Featured      bool           `gorm:"default:false" json:"featured"`
	Status        string         `gorm:"type:varchar(20);not null;default:'published';index" json:"status"`
	Shares        int            `gorm:"default:0" json:"shares"`
	ViewCount     uint           `gorm:"default:0" json:"viewCount"`
	PublishedAt   *time.Time     `json:"publishedAt,omitempty"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

type CommentStatus string

const (
	CommentPending  CommentStatus = "pending"
	CommentApproved CommentStatus = "approved"
	CommentRejected CommentStatus = "rejected"
)

// Comment - Comentários em Notícias
type Comment struct {
	ID          uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	ArticleID   uint           `gorm:"not null;index" json:"articleId"`
	ParentID    *uint          `gorm:"index" json:"parentId,omitempty"`
	Article     *Article       `gorm:"foreignKey:ArticleID" json:"article,omitempty"`
	ArticleTitle string        `gorm:"-" json:"articleTitle,omitempty"`
	AuthorName  string         `gorm:"type:varchar(255);not null" json:"authorName"`
	AuthorEmail string         `gorm:"type:varchar(255);not null" json:"authorEmail"`
	Content     string         `gorm:"type:text;not null" json:"content"`
	Status      CommentStatus  `gorm:"type:varchar(20);not null;default:'pending';index" json:"status"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

// OfficialDocument - CMS Editais e Atas
type OfficialDocument struct {
	ID          uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Code        string         `gorm:"type:varchar(100)" json:"code"`
	Type        string         `gorm:"type:varchar(100)" json:"type"`
	Date        string         `gorm:"type:varchar(100)" json:"date"`
	Size        string         `gorm:"type:varchar(50)" json:"size"`
	Status      string         `gorm:"type:varchar(50)" json:"status"`
	Summary     string         `gorm:"type:text" json:"summary"`
	Description string         `gorm:"type:text" json:"description,omitempty"`
	Category    string         `gorm:"type:varchar(100)" json:"category,omitempty"`
	DownloadURL string         `gorm:"type:varchar(255)" json:"downloadUrl"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

// CalendarEvent - CMS Agenda de Eventos
type CalendarEvent struct {
	ID          uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Day         string         `gorm:"type:varchar(10)" json:"day"`
	Month       string         `gorm:"type:varchar(20)" json:"month"`
	Year        string         `gorm:"type:varchar(10)" json:"year"`
	Time        string         `gorm:"type:varchar(50)" json:"time"`
	Modality    string         `gorm:"type:varchar(100)" json:"modality"`
	Location    string         `gorm:"type:varchar(255)" json:"location"`
	Description string         `gorm:"type:text" json:"description"`
	Category    string         `gorm:"type:varchar(100)" json:"category"`
	Registered  bool           `gorm:"default:false" json:"registered"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

// VideoEpisode - CMS Vídeos / TV Porto Cercado
type VideoEpisode struct {
	ID            uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Title         string         `gorm:"type:varchar(255);not null" json:"title"`
	Category      string         `gorm:"type:varchar(100)" json:"category"`
	CategoryColor string         `gorm:"type:varchar(100)" json:"categoryColor"`
	Duration      string         `gorm:"type:varchar(50)" json:"duration"`
	Published     string         `gorm:"type:varchar(100)" json:"published"`
	ImageURL      string         `gorm:"type:varchar(255)" json:"imageUrl"`
	Presenter     string         `gorm:"type:varchar(255)" json:"presenter,omitempty"`
	Description   string         `gorm:"type:text" json:"description,omitempty"`
	VideoURL      string         `gorm:"type:varchar(255)" json:"videoUrl,omitempty"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

// --- DTOs (Data Transfer Objects) ---

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type CreateUserRequest struct {
	Name     string   `json:"name"`
	Email    string   `json:"email"`
	Password string   `json:"password"`
	Role     UserRole `json:"role"`
	Ativo    bool     `json:"ativo"`
}

type UpdateUserRequest struct {
	Name     string   `json:"name"`
	Email    string   `json:"email"`
	Password string   `json:"password,omitempty"`
	Role     UserRole `json:"role"`
	Ativo    bool     `json:"ativo"`
}

type AIChatRequest struct {
	Prompt  string `json:"prompt"`
	Context string `json:"context,omitempty"`
}

type AIChatResponse struct {
	Reply     string         `json:"reply"`
	Timestamp string         `json:"timestamp"`
	Title     string         `json:"title,omitempty"`
	Summary   string         `json:"summary,omitempty"`
	Content   string         `json:"content,omitempty"`
	Provider  string         `json:"provider"`
	Sources   []AINewsSource `json:"sources,omitempty"`
}

type AIImageRequest struct {
	Prompt string `json:"prompt"`
}

type AINewsSource struct {
	Title       string `json:"title"`
	URL         string `json:"url"`
	PublishedAt string `json:"publishedAt,omitempty"`
}
