import { ToolInvocation } from "ai";
import { memo, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

const toolNames = {
    getWeather: 'Getting weather data...',
    getMemory: 'Searching memory...',
}

function PureMessageToolInvocation({ toolInvocation }: { toolInvocation: ToolInvocation }) {
    const { toolName, args } = toolInvocation;
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex flex-col gap-2 pb-2 max-w-3xl w-full">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-copywrit-cream cursor-pointer hover:text-copywrit-cream/80 transition-colors"
            >
                {isExpanded ? (
                    <ChevronUpIcon className="w-4 h-4" />
                ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{toolNames[toolName as keyof typeof toolNames]}</span>
            </button>
            {isExpanded && (
                <div className="p-4 rounded-md bg-secondary/10 text-xs border">
                    <pre className="whitespace-pre-wrap font-mono text-xs overflow-x-auto">
                        Searched memory for: {JSON.stringify(args.searchString)}...
                    </pre>
                </div>
            )}
        </div>
    );
}

const MessageToolInvocation = memo(PureMessageToolInvocation, (prev, next) => {
    return (
        prev.toolInvocation.toolName === next.toolInvocation.toolName &&
        JSON.stringify(prev.toolInvocation.args) === JSON.stringify(next.toolInvocation.args)
    );
});

export { MessageToolInvocation };