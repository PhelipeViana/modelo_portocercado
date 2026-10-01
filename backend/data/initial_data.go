package data

import "porto-cercado-backend/models"

var Articles = []models.Article{
	{
		ID:            1,
		Slug:          "pesca-esportiva-sustentavel-porto-cercado",
		Title:         "Guia da Pesca Esportiva Sustentável em Porto Cercado",
		Subtitle:      "Boas práticas para a conservação das espécies no Pantanal Mato-Grossense",
		Summary:       "Descubra as principais normas de pesque-e-solte, épocas de defeso e como preservar a fauna aquática de Porto Cercado.",
		Content:       "<p>Porto Cercado é um dos principais polos de turismo ecológico e pesca esportiva do Pantanal. Com a biodiversidade exuberante da região, a prática consciente da pesca é fundamental.</p><p>Neste guia completo, abordamos as melhores técnicas para garantir o bem-estar do peixe após a captura, equipamentos recomendados e a legislação ambiental vigente.</p><p>Respeitar as cotas e períodos de defeso garante que as futuras gerações continuem desfrutando das riquezas de nossas águas.</p>",
		Category:      "Turismo & Pesca",
		CategoryColor: "emerald",
		Tag:           "Sustentabilidade",
		ImageURL:      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
		AuthorName:    "Conselho de Meio Ambiente",
		AuthorRole:    "Comissão de Sustentabilidade",
		AuthorInit:    "CMA",
		Date:          "28 de Setembro, 2026",
		ReadTime:      "5 min de leitura",
		Featured:      true,
		Status:        "published",
		Shares:        142,
	},
	{
		ID:            2,
		Slug:          "melhorias-infraestrutura-acesso-marina",
		Title:         "Obras de Infraestrutura no Acesso à Marina e Porto",
		Subtitle:      "Pavimentação e sinalização para o acesso seguro dos associados e visitantes",
		Summary:       "Confira os detalhes das melhorias viárias aprovadas para a região do Porto Cercado.",
		Content:       "<p>A diretoria comunica o início das obras de melhoria na via principal de acesso ao porto.</p><p>O projeto inclui nova pavimentação, sinalização noturna e pontos de apoio náutico.</p>",
		Category:      "Infraestrutura",
		CategoryColor: "amber",
		Tag:           "Obras",
		ImageURL:      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
		AuthorName:    "Diretoria de Obras",
		AuthorRole:    "Gestão 2025/2027",
		AuthorInit:    "DO",
		Date:          "25 de Setembro, 2026",
		ReadTime:      "4 min de leitura",
		Featured:      false,
		Status:        "published",
		Shares:        89,
	},
}

var Documents = []models.OfficialDocument{
	{
		ID:          1,
		Title:       "Edital de Convocação - Assembleia Geral Ordinária 2026",
		Code:        "ED-2026/04",
		Type:        "Edital",
		Date:        "20/09/2026",
		Size:        "1.2 MB",
		Status:      "Vigente",
		Summary:     "Convocação para eleição da nova diretoria e prestação de contas do exercício 2025.",
		DownloadURL: "#",
	},
	{
		ID:          2,
		Title:       "Ata da Reunião de Diretoria - Setembro 2026",
		Code:        "ATA-2026/09",
		Type:        "Ata",
		Date:        "15/09/2026",
		Size:        "850 KB",
		Status:      "Aprovado",
		Summary:     "Aprovação de investimentos em segurança náutica e reformas de infraestrutura.",
		DownloadURL: "#",
	},
}

var Events = []models.CalendarEvent{
	{
		ID:          1,
		Title:       "Torneio Anual de Pesca Esportiva Porto Cercado",
		Day:         "15",
		Month:       "OUT",
		Year:        "2026",
		Time:        "07:00 - 18:00",
		Modality:    "Presencial",
		Location:    "Marina Porto Cercado - Pantanal",
		Description: "Competição de pesque-e-solte com premiações para maiores exemplares e categorias sustentáveis.",
		Category:    "Evento Esportivo",
		Registered:  false,
	},
	{
		ID:          2,
		Title:       "Assembleia Geral Ordinária de Associados",
		Day:         "22",
		Month:       "OUT",
		Year:        "2026",
		Time:        "19:30",
		Modality:    "Híbrido",
		Location:    "Sede Social & Transmissão Online",
		Description: "Prestação de contas do 3º trimestre e deliberação sobre novos projetos de preservação ambiental.",
		Category:    "Institucional",
		Registered:  true,
	},
}

var Videos = []models.VideoEpisode{
	{
		ID:            1,
		Title:         "Documentário: As Cores e Aves de Porto Cercado",
		Category:      "Documentário",
		CategoryColor: "cyan",
		Duration:      "18:45",
		Published:     "12 de Setembro, 2026",
		ImageURL:      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
		Presenter:     "Canal Pantanal Vivo",
		Description:   "Um olhar pelas maravilhas naturais e biodiversidade que cercam Porto Cercado.",
	},
}
