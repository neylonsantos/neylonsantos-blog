import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);

  // Dados mockados simulando os posts do blog
  const posts = [
    {
      id: 1,
      date: 'Terça, Abril 06 2026',
      title: 'Configurando o Neovim para produtividade',
      category: 'Dev',
      color: 'text-blue-400',
      icon: '💻',
      excerpt: 'Minha jornada abandonando as IDEs pesadas e voltando para o terminal.',
      content: 'Aqui entraria o texto completo sobre como configurei os plugins, lsp, e atalhos de teclado. A curva de aprendizado é alta, mas a recompensa em velocidade é inestimável...',
      views: 1024
    },
    {
      id: 2,
      date: 'Segunda, Março 30 2026',
      title: 'A arte do trabalho focado (Deep Work)',
      category: 'Mindset',
      color: 'text-yellow-400',
      icon: '🧠',
      excerpt: 'Como conseguir 4 horas de trabalho ininterrupto no mundo moderno.',
      content: 'Desligar as notificações não é o suficiente. O verdadeiro deep work exige um preparo mental e um ambiente controlado. Neste post, discuto as táticas que tirei do livro de Cal Newport...',
      views: 840
    },
    {
      id: 3,
      date: 'Sexta, Março 27 2026',
      title: 'Rotina de Descompressão Noturna',
      category: 'Lifestyle',
      color: 'text-purple-400',
      icon: '🌙',
      excerpt: 'Desligando as telas e preparando o cérebro para o descanso.',
      content: 'Nenhuma tela após as 21h. Parece impossível? Eu achei que fosse. Mas trocar o celular por um Kindle e uma xícara de chá mudou completamente minha qualidade de sono...',
      views: 512
    }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono p-4 sm:p-6 md:p-8 flex justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Top Navigation */}
        <nav className="flex justify-between border-b border-gray-800 pb-2 mb-6 text-sm">
          <div className="flex space-x-6">
            <button 
              onClick={() => {setActiveTab('posts'); setSelectedPost(null);}}
              className={`${activeTab === 'posts' ? 'text-green-400 border-b border-green-400 pb-2 -mb-[9px]' : 'text-gray-500 hover:text-gray-400'}`}
            >
              posts
            </button>
            <button 
              onClick={() => {setActiveTab('about'); setSelectedPost(null);}}
              className={`${activeTab === 'about' ? 'text-green-400 border-b border-green-400 pb-2 -mb-[9px]' : 'text-gray-500 hover:text-gray-400'}`}
            >
              sobre
            </button>
            <button 
              onClick={() => {setActiveTab('stats'); setSelectedPost(null);}}
              className={`${activeTab === 'stats' ? 'text-green-400 border-b border-green-400 pb-2 -mb-[9px]' : 'text-gray-500 hover:text-gray-400'}`}
            >
              stats
            </button>
          </div>
        </nav>

        {/* Terminal Header */}
        <header className="mb-8">
          <div className="flex items-center text-sm md:text-base break-all">
            <span className="text-green-400">visitante</span>
            <span className="text-gray-500">@</span>
            <span className="text-blue-400">blog.init</span>
            <span className="text-gray-300 ml-2">$ {selectedPost ? `cat post_${selectedPost.id}.md` : 'ls -la posts/'}</span>
          </div>
          {!selectedPost && (
            <div className="text-gray-500 text-sm mt-2">
              // {posts.length} artigos publicados. você está explorando os arquivos.
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main>
          {/* Aba de Posts (Lista) */}
          {activeTab === 'posts' && !selectedPost && (
            <div className="space-y-8">
              {posts.map((post) => (
                <div key={post.id} className="group cursor-pointer" onClick={() => setSelectedPost(post)}>
                  {/* Data do Post - Estilo Calendário/Comentário */}
                  <div className="flex items-center text-sm mb-2">
                    <span className="text-green-400 mr-2">📅</span>
                    <span className="text-gray-400">{post.date}</span>
                    <span className="text-gray-600 ml-3">* {post.views} views</span>
                  </div>

                  {/* Título e Categoria */}
                  <div className="flex items-start justify-between border-b border-gray-900 pb-4">
                    <div>
                      <h2 className={`text-lg md:text-xl font-bold flex items-center ${post.color}`}>
                        <span className="mr-2">{post.icon}</span>
                        {post.title}
                      </h2>
                      {/* Excerpt como comentário */}
                      <p className="text-gray-500 text-sm mt-1 ml-6">
                        // {post.excerpt}
                      </p>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 hidden sm:block">
                      [{post.category}]
                    </div>
                  </div>
                  
                  {/* Pseudo-botão "Ler mais" que aparece no hover (simulado via cor) */}
                  <div className="text-sm mt-2 ml-6 text-gray-700 group-hover:text-green-400 transition-colors">
                    {'>'} ler conteúdo...
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Visualização de um Post Único */}
          {activeTab === 'posts' && selectedPost && (
            <article className="animate-fade-in">
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-gray-500 hover:text-green-400 mb-6 text-sm flex items-center"
              >
                {'<'} voltar_para_lista
              </button>

              <div className="mb-6">
                <h1 className={`text-2xl font-bold ${selectedPost.color} mb-2`}>
                  {selectedPost.icon} {selectedPost.title}
                </h1>
                <div className="text-gray-500 text-sm flex space-x-4">
                  <span>// Data: {selectedPost.date}</span>
                  <span>// Categoria: {selectedPost.category}</span>
                </div>
              </div>

              <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-wrap">
                <p>{selectedPost.content}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                
                <div className="bg-gray-900 p-4 rounded-sm border-l-2 border-green-400 my-6">
                  <span className="text-gray-500">// nota do autor:</span><br/>
                  <span className="text-gray-400">A consistência é mais importante que a intensidade. Pequenos hábitos diários constroem o futuro.</span>
                </div>
                
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>

              <div className="mt-12 pt-4 border-t border-gray-800 text-center text-sm text-gray-600">
                [ fim do arquivo ]
              </div>
            </article>
          )}

          {/* Aba Sobre */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <h2 className="text-green-400 text-xl font-bold mb-4">👤 profile</h2>
              <p className="text-gray-500">// Olá, mundo.</p>
              <p>Sou um desenvolvedor minimalista que gosta de telas pretas, fontes monoespaçadas e produtividade extrema.</p>
              <p>Este blog é meu diário digital. Sem anúncios, sem pop-ups, apenas texto.</p>
              
              <div className="mt-8 space-y-2">
                <div className="flex">
                  <span className="text-gray-500 w-24">Location:</span>
                  <span>São Paulo, BR</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24">Stack:</span>
                  <span className="text-blue-400">React, Tailwind, Node.js</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-24">Status:</span>
                  <span className="text-green-400">Online</span>
                </div>
              </div>
            </div>
          )}

          {/* Aba Stats */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
               <h2 className="text-yellow-400 text-xl font-bold mb-4">📊 server_stats</h2>
               <div className="border border-gray-800 p-4 rounded-sm bg-gray-950">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Uptime</span>
                    <span className="text-green-400">99.9%</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Posts totais</span>
                    <span>{posts.length}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Cafés consumidos</span>
                    <span className="text-yellow-400">1.337</span>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-800">
                    <div className="text-gray-500 text-xs">// uso de banda</div>
                    <div className="w-full bg-gray-900 h-2 mt-2 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full w-[45%]"></div>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </main>

        {/* Footer actions like the bottom buttons in the image */}
        <footer className="mt-16 pt-4 flex justify-between items-center text-sm border-t border-gray-900">
          <div className="flex space-x-3">
            <button className="text-green-400 bg-green-950/30 px-3 py-1 border border-green-900/50 hover:bg-green-900/50 transition-colors">
              + assinar rss
            </button>
            <button className="text-blue-400 bg-blue-950/30 px-3 py-1 border border-blue-900/50 hover:bg-blue-900/50 transition-colors">
              @ contato
            </button>
          </div>
          <div className="text-gray-600">
            [v1.0.4]
          </div>
        </footer>

      </div>
    </div>
  );
}