import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Phone, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Fish
} from 'lucide-react';
import { PESQUEIROS_PORTO_CERCADO, PORTO_CERCADO_INFO } from '../data/pesqueirosData';

export const InscricaoView: React.FC = () => {
  // Step 1: Pesqueiro selecionado
  const [selectedLocalId, setSelectedLocalId] = useState<string>('');
  
  // Step 2: Form fields
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [sexo, setSexo] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Status
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedLocal = PESQUEIROS_PORTO_CERCADO.find(p => p.id === selectedLocalId);

  // Format CPF helper
  const handleCpfChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 9) {
      formatted = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
    } else if (raw.length > 6) {
      formatted = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    } else if (raw.length > 3) {
      formatted = `${raw.slice(0, 3)}.${raw.slice(3)}`;
    }
    setCpf(formatted);
  };

  // Format Telefone helper
  const handleTelefoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 10) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
    } else if (raw.length > 6) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`;
    } else if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    setTelefone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedLocalId) {
      setErrorMessage('Por favor, selecione o seu pesqueiro ou rancho.');
      return;
    }

    if (!nome.trim() || !cpf.trim() || !email.trim() || !telefone.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (senha.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMessage('A confirmação de senha não confere com a senha digitada.');
      return;
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSelectedLocalId('');
    setNome('');
    setCpf('');
    setSexo('');
    setNascimento('');
    setEstadoCivil('');
    setTelefone('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    setIsSubmitted(false);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 dark:bg-[#090D16] py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-emerald-600/5 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Main Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/80 dark:border-slate-800 transition-colors">
          
          {/* Header Banner */}
          <div className="relative bg-[#064E3B] dark:bg-[#03291f] px-8 py-12 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 L 100 0 L 0 0 Z" fill="white"></path>
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex justify-center mb-5">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 inline-block shadow-2xl">
                  <img 
                    src={PORTO_CERCADO_INFO.logoWhiteUrl} 
                    alt="Logo Associação Porto Cercado" 
                    className="h-16 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                FICHA DE FILIAÇÃO
              </h1>
              <p className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-xs">
                Associação dos Ribeirinhos do Porto Cercado - Pantanal Verde
              </p>
            </div>
          </div>

          {/* Rainbow green bar */}
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500"></div>

          {/* Body Section */}
          <div className="p-6 sm:p-10 md:p-14">

            {isSubmitted ? (
              <div className="max-w-xl mx-auto text-center space-y-6 py-6">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Ficha Cadastral Transmitida
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    Filiação Registrada com Sucesso!
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
                    Parabéns, <strong className="text-slate-900 dark:text-white">{nome}</strong>! Sua solicitação de filiação vinculada ao <strong className="text-emerald-700 dark:text-emerald-400">{selectedLocal?.name}</strong> foi registrada no sistema da Associação.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-left text-xs text-slate-700 dark:text-slate-200 space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Pesqueiro / Rancho:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{selectedLocal?.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">CPF Registrado:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{cpf}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Telefone / WhatsApp:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{telefone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">E-mail:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{email}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a
                    href={`https://api.whatsapp.com/send/?phone=5565998059960&text=Olá! Acabei de enviar minha ficha cadastral para a Associação Porto Cercado no pesqueiro ${encodeURIComponent(selectedLocal?.name || '')}. Nome: ${encodeURIComponent(nome)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Confirmar no WhatsApp Oficial</span>
                  </a>

                  <button
                    onClick={handleReset}
                    className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Nova Inscrição
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-10">

                {/* PASSO 1: Seleção do Pesqueiro / Rancho */}
                <section className="max-w-xl mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/60 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                      <Fish className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Etapa 1 de 2</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Encontre seu pesqueiro 🎣
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      O primeiro passo da sua jornada é identificar sua localização pantaneira.
                    </p>
                  </div>

                  <div className="relative group">
                    <select
                      value={selectedLocalId}
                      onChange={(e) => setSelectedLocalId(e.target.value)}
                      className="block w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold appearance-none pr-12 cursor-pointer shadow-sm text-sm"
                    >
                      <option value="">Selecione o pesqueiro na lista...</option>
                      {PESQUEIROS_PORTO_CERCADO.map((p) => (
                        <option key={p.id} value={p.id} className="dark:bg-slate-800">
                          {p.name}
                        </option>
                      ))}
                    </select>
                    
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-emerald-600 dark:text-emerald-400 transition-transform group-hover:translate-y-0.5">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Fallback caso não encontre */}
                  <div className="space-y-3 pt-2">
                    <a
                      href="https://api.whatsapp.com/send/?phone=556599285846&text=Olá, gostaria de fazer minha inscrição, não encontrei meu pesqueiro na lista."
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full text-center px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-750 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 transition-all"
                    >
                      Não encontrou seu pesqueiro? Fale no WhatsApp
                    </a>
                    <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      A gente cadastra rapidinho pra você continuar.
                    </p>
                  </div>
                </section>

                {/* PASSO 2: Ficha Cadastral */}
                {selectedLocal && (
                  <div id="form-container" className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800 animate-in fade-in duration-500">
                    
                    {/* Pesqueiro selecionado badge */}
                    <div className="mb-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm">
                          🎣
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
                            Pesqueiro Selecionado
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white text-base">
                            {selectedLocal.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-emerald-200 dark:border-slate-700">
                        Localidade #{selectedLocal.id}
                      </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                      
                      {errorMessage && (
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-bold">
                          {errorMessage}
                        </div>
                      )}

                      {/* Bloco 1: Dados Pessoais */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <span className="shrink-0 w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-600/20">
                            1
                          </span>
                          <h3 className="text-xl font-black text-[#064E3B] dark:text-emerald-400 uppercase tracking-tight">
                            Dados Pessoais
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Nome Completo */}
                          <div className="md:col-span-2">
                            <label htmlFor="nome" className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2 ml-1">
                              Nome Completo *
                            </label>
                            <input
                              type="text"
                              id="nome"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              placeholder="Ex: João da Silva Pantaneiro"
                              required
                              className="block w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
                            />
                          </div>

                          {/* CPF */}
                          <div>
                            <label htmlFor="cpf" className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2 ml-1">
                              CPF *
                            </label>
                            <input
                              type="text"
                              id="cpf"
                              value={cpf}
                              onChange={(e) => handleCpfChange(e.target.value)}
                              placeholder="000.000.000-00"
                              required
                              className="block w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
                            />
                          </div>

                          {/* Sexo */}
                          <div>
                            <label htmlFor="sexo" className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2 ml-1">
                              Sexo
                            </label>
                            <select
                              id="sexo"
                              value={sexo}
                              onChange={(e) => setSexo(e.target.value)}
                              className="block w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
                            >
                              <option value="">Selecione...</option>
                              <option value="masculino">Masculino</option>
                              <option value="feminino">Feminino</option>
                            </select>
                          </div>

                          {/* Data de Nascimento */}
                          <div>
                            <label htmlFor="nascimento" className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2 ml-1">
                              Data de Nascimento
                            </label>
                            <input
                              type="date"
                              id="nascimento"
                              value={nascimento}
                              onChange={(e) => setNascimento(e.target.value)}
                              className="block w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
                            />
                          </div>

                          {/* Estado Civil */}
                          <div>
                            <label htmlFor="estado_civil" className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2 ml-1">
                              Estado Civil
                            </label>
                            <select
                              id="estado_civil"
                              value={estadoCivil}
                              onChange={(e) => setEstadoCivil(e.target.value)}
                              className="block w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
                            >
                              <option value="">Selecione...</option>
                              <option value="solteiro">Solteiro(a)</option>
                              <option value="casado">Casado(a)</option>
                              <option value="divorciado">Divorciado(a)</option>
                              <option value="viuvo">Viúvo(a)</option>
                            </select>
                          </div>

                        </div>
                      </div>

                      {/* Bloco 2: Contato e Acesso */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <span className="shrink-0 w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-600/20">
                            2
                          </span>
                          <h3 className="text-xl font-black text-[#064E3B] dark:text-emerald-400 uppercase tracking-tight">
                            Contato e Acesso
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* WhatsApp / Telefone */}
                          <div>
                            <label htmlFor="telefone" className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2 ml-1">
                              WhatsApp / Telefone *
                            </label>
                            <input
                              type="text"
                              id="telefone"
                              value={telefone}
                              onChange={(e) => handleTelefoneChange(e.target.value)}
                              placeholder="(65) 99999-9999"
                              required
                              className="block w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label htmlFor="email" className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2 ml-1">
                              E-mail (Login) *
                            </label>
                            <input
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="seuemail@exemplo.com"
                              required
                              className="block w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
                            />
                          </div>

                          {/* Senha */}
                          <div className="relative">
                            <label htmlFor="senha" className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2 ml-1">
                              Criar Senha *
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                id="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                required
                                className="block w-full px-5 py-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Confirmar Senha */}
                          <div className="relative">
                            <label htmlFor="confirmar_senha" className="block text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2 ml-1">
                              Confirmar Senha *
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmar_senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                placeholder="Repita a senha"
                                required
                                className="block w-full px-5 py-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Botão de Envio */}
                      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Seus dados estão protegidos de acordo com a LGPD e o Estatuto da Associação.</span>
                        </div>

                        <button
                          type="submit"
                          className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-600/30 transform active:scale-95 transition-all cursor-pointer"
                        >
                          Enviar Ficha Cadastral
                        </button>
                      </div>

                    </form>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Footer Card */}
          <div className="bg-[#064E3B] dark:bg-[#03291f] px-8 py-6 text-center border-t border-white/5">
            <p className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-[0.3em]">
              © 2026 Associação dos Ribeirinhos do Porto Cercado - Pantanal Verde • CNPJ: 61.968.959/0001-00
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
