'use client'
import { memo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils/twUtils';

interface SimpleMarkdownProps {
  content: string;
  className?: string;
}

// Custom components that exclude code blocks and math
const components: Components = {
  // Simple inline code styling
  code: ({ children }) => (
    <span className="mx-1 px-2 py-0.5 bg-copywrit-cream/10 text-copywrit-cream rounded text-sm font-mono">
      {children}
    </span>
  ),
  pre: ({ children }) => (
    <div className="my-3 p-4 bg-copywrit-cream/5 border border-copywrit-cream/20 rounded-lg overflow-x-auto">
      <div className="text-copywrit-cream/90 font-mono text-sm">
        {children}
      </div>
    </div>
  ),
  // Ensure proper styling for other elements
  p: ({ children }) => (
    <p className="mb-3 last:mb-0 leading-relaxed text-copywrit-cream">{children}</p>
  ),
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0 text-copywrit-cream">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0 text-copywrit-cream">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold mb-2 mt-4 first:mt-0 text-copywrit-cream">{children}</h3>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-3 space-y-1 text-copywrit-cream">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-3 space-y-1 text-copywrit-cream">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed text-copywrit-cream">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-copywrit-cream/30 pl-4 my-3 italic text-copywrit-cream/80">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-copywrit-cream">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-copywrit-cream">{children}</em>
  ),
  a: ({ href, children }) => (
    <a 
      href={href} 
      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

function PureSimpleMarkdown({ content, className }: SimpleMarkdownProps) {
  return (
    <div className={cn("text-sm sm:text-base leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
        // Disable HTML parsing for security and performance
        disallowedElements={['script', 'style', 'iframe']}
        unwrapDisallowed={true}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Simple memoization that only re-renders when content changes
const SimpleMarkdown = memo(PureSimpleMarkdown, (prevProps, nextProps) => {
  return prevProps.content === nextProps.content && prevProps.className === nextProps.className;
});

SimpleMarkdown.displayName = 'SimpleMarkdown';

export default SimpleMarkdown; 