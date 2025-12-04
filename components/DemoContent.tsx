import React from 'react';

export const DemoContent: React.FC<{ highContrast: boolean }> = ({ highContrast }) => {
  const cardClass = highContrast 
    ? "border border-white p-6 mb-6" 
    : "bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100";

  return (
    <div>
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Web Acessível para Todos</h1>
        <p className="text-xl opacity-80 max-w-2xl mx-auto">
          Esta página demonstra como ferramentas de acessibilidade podem melhorar a experiência do usuário. 
          Use a barra lateral para interagir com este conteúdo.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <section className={cardClass}>
          <h2 className="text-2xl font-bold mb-3 text-blue-500">O que é Acessibilidade?</h2>
          <p className="mb-4 leading-relaxed">
            Acessibilidade na Web significa que sites, ferramentas e tecnologias são projetados e desenvolvidos para que pessoas com deficiência possam usá-los. Mais especificamente, as pessoas podem:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Perceber, entender, navegar e interagir com a Web.</li>
            <li>Contribuir para a Web.</li>
          </ul>
          <a href="#" onClick={(e) => e.preventDefault()}>Saiba mais sobre a W3C</a>
        </section>

        <section className={cardClass}>
          <h2 className="text-2xl font-bold mb-3 text-red-500">Cores e Contraste</h2>
          <p className="mb-4 leading-relaxed">
            O daltonismo afeta aproximadamente 1 em cada 12 homens e 1 em cada 200 mulheres no mundo. 
            Ferramentas que ajustam o contraste ou simulam filtros ajudam desenvolvedores a criar designs mais inclusivos.
          </p>
          <div className="flex gap-4 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Verm</div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Verd</div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Azul</div>
          </div>
          <a href="#" onClick={(e) => e.preventDefault()}>Teste de cores</a>
        </section>

        <section className={`${cardClass} md:col-span-2`}>
          <h2 className="text-2xl font-bold mb-3 text-purple-500">Exemplo de Imagem e Gráficos</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <img 
              src="https://picsum.photos/400/300" 
              alt="Exemplo aleatório de paisagem ou arquitetura" 
              className="rounded shadow-sm max-w-full h-auto grayscale-0"
            />
            <div>
              <p className="mb-4 leading-relaxed">
                Imagens devem sempre conter texto alternativo (`alt`). Além disso, ao usar filtros de escala de cinza ou de correção de daltonismo, verifique como a percepção da imagem muda.
              </p>
              <p className="leading-relaxed">
                Tente ativar a <strong>Linha Guia de Leitura</strong> na barra lateral para focar neste parágrafo. Ela ajuda usuários com dislexia ou dificuldades de concentração a manter o foco na linha que está sendo lida.
              </p>
              <div className="mt-4">
                 <a href="#" onClick={(e) => e.preventDefault()} className="mr-4">Galeria de Imagens</a>
                 <a href="#" onClick={(e) => e.preventDefault()}>Diretrizes de Imagem</a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-12 text-center text-sm opacity-60 pb-12">
        <p>&copy; 2023 Demonstração de Acessibilidade. Feito com React e Tailwind.</p>
      </footer>
    </div>
  );
};