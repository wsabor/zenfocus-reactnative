# 🌌 Zen Focus

**Zen Focus** é um aplicativo de produtividade minimalista e relaxante projetado para ajudar você a manter a concentração, organizar suas tarefas diárias e acompanhar seu estado mental e intenções em um ambiente calmo e livre de distrações.

Desenvolvido com **React**, **Vite** e **Tailwind CSS v4**, o projeto utiliza recursos nativos como a **Web Audio API** para proporcionar uma experiência imersiva e relaxante direta no navegador, sem a necessidade de APIs ou serviços externos de terceiros.

---

## ✨ Funcionalidades Principais

### 1. 🌊 Ruído Zen (Soundscape)
* **Síntese de Áudio Nativa**: Utiliza a *Web Audio API* do navegador para gerar ruído browniano (que imita o som de chuva ou ondas do mar) em tempo real de forma inteiramente sintética.
* **Modulação Dinâmica**: Um oscilador de baixa frequência (LFO) modula a frequência de corte do filtro passa-baixa a cada 12 segundos para simular o movimento natural e relaxante das ondas do oceano.
* **Fade-In Suave**: Transição suave de volume ao ativar ou desativar o som para evitar sobressaltos ou desconforto.

### 2. ⏱️ Timer Pomodoro Circular
* **Modos de Foco & Descanso**: Presets configuráveis para **Foco (25 min)**, **Pausa Curta (5 min)** e **Pausa Longa (15 min)**.
* **Indicador Visual de Progresso**: Um SVG dinâmico em formato de círculo com efeitos de brilho em neon (Glow) que mostra visualmente o tempo restante.
* **Sino Zen (Zen Chime)**: Ao completar um ciclo, sintetiza um som harmônico de sino de vento de dupla frequência e alterna automaticamente para o próximo modo recomendado.
* **Controles Rápidos**: Funções intuitivas para iniciar/pausar, reiniciar e pular para o próximo ciclo de tempo.

### 3. 🎯 Foco de Hoje (Lista de Tarefas)
* **Gerenciador Simplificado**: Adicione tarefas rápidas para manter a direção durante o seu dia.
* **Priorização**: Classifique tarefas por prioridade (**Alta**, **Média** ou **Baixa**) com identificadores visuais coloridos.
* **Filtros de Visualização**: Alterne entre ver *Tudo*, apenas as *Ativas* ou as *Concluídas*.
* **Persistência Local**: Suas tarefas são salvas automaticamente no `localStorage` do navegador para manter seu progresso salvo entre sessões.

### 4. ✍️ Diário de Estado & Intenção
* **Acompanhamento de Humor**: Registre como você se sente no momento através de emojis de humor representativos (*Inspirado*, *Focado*, *Calmo*, *Reflexivo*, *Cansado*).
* **Definição de Intenção**: Escreva o foco ou a intenção principal do seu dia para guiar suas ações de forma consciente.
* **Histórico Recente**: Exibe os registros anteriores com data e opção de exclusão rápida.
* **Persistência Local**: Histórico persistido inteiramente no navegador para privacidade e controle total.

---

## 🛠️ Stack Tecnológica

* **Core**: [React 19](https://react.dev/) & [Vite](https://vite.dev/)
* **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) (com o novo compilador `@tailwindcss/vite`)
* **Ícones**: [Lucide React](https://lucide.dev/)
* **Som**: Web Audio API (nativo do navegador)

---

## 🎨 Design System & Estética

O Zen Focus adota uma estética moderna de **Glassmorphism** (efeito de vidro fosco) projetada para proporcionar tranquilidade visual:
* **Fundo Gradiente Profundo**: Paleta de cores escuras e relaxantes com gradientes em tons de roxo, azul e verde-teal.
* **Painéis de Vidro**: Efeito translúcido utilizando `backdrop-blur` e bordas sutis de contraste.
* **Micro-animações**: Flutuações suaves em elementos decorativos e transições de hover animadas nos cards e botões.
* **Glow Effects**: Sombras e textos com efeito neon roxo e verde-água para realçar informações importantes.

---

## 📁 Estrutura de Pastas do Projeto

```
antigravity/
├── src/
│   ├── assets/             # Recursos estáticos (imagens, SVGs, etc.)
│   ├── components/         # Componentes React reutilizáveis
│   │   ├── Journal.jsx     # Diário de estado e intenções do dia
│   │   ├── Tasks.jsx       # Lista de tarefas diárias com controle de prioridades
│   │   └── Timer.jsx       # Timer pomodoro circular com áudio sintético e presets
│   ├── App.css             # Estilos de layout legados/auxiliares
│   ├── index.css           # Configurações do Tailwind CSS v4 & classes utilitárias globais
│   ├── main.jsx            # Ponto de entrada do React
│   └── App.jsx             # Estrutura principal da página, cabeçalho e gerador de Ruído Zen
├── eslint.config.js        # Configurações do ESLint para qualidade e padronização do código
├── vite.config.js          # Configuração do Vite e plugins (React & Tailwind CSS v4)
├── package.json            # Dependências do projeto e scripts npm
└── README.md               # Documentação do projeto (este arquivo)
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js instalado (versão 18 ou superior recomendada)
* Gerenciador de pacotes npm (já vem empacotado com o Node.js)

### Instruções passo a passo

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   *O projeto estará disponível por padrão em `http://localhost:5173` ou conforme indicado no terminal.*

3. **Gere a versão de produção (opcional):**
   ```bash
   npm run build
   ```

4. **Visualize a build de produção localmente (opcional):**
   ```bash
   npm run preview
   ```

---

## 🔒 Segurança e Privacidade

Todos os seus dados (tarefas e registros do diário) são armazenados localmente no navegador por meio de `localStorage`. O aplicativo não realiza requisições de rede externas nem envia suas informações para servidores de terceiros, garantindo privacidade absoluta e permitindo o uso 100% offline.
