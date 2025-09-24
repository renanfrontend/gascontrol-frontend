import { Github } from 'lucide-react';

export function Footer() {
  const githubUrl = "https://github.com/renanfrontend";

  return (
    <footer className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-8 py-4">
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        
        {/* Espaçador Esquerdo (para ajudar a centralizar o texto do meio) */}
        <div className="flex-1"></div>

        {/* Texto Centralizado */}
        <p className="flex-1 text-center">
          Desenvolvido com ❤️ por Renan Augusto
        </p>
        
        {/* Link do GitHub alinhado à direita */}
        <div className="flex-1 flex justify-end">
          <a 
            href={githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>renanfrontend</span>
          </a>
        </div>

      </div>
    </footer>
  );
}