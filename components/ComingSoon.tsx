import { Clock, Sparkles } from 'lucide-react';

interface ComingSoonProps {
  feature?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function ComingSoon({ feature = 'This feature', size = 'medium' }: ComingSoonProps) {
  const sizes = {
    small: {
      container: 'py-8',
      icon: 32,
      title: 'text-2xl',
      text: 'text-sm',
    },
    medium: {
      container: 'py-12',
      icon: 48,
      title: 'text-3xl',
      text: 'text-base',
    },
    large: {
      container: 'py-16',
      icon: 64,
      title: 'text-4xl',
      text: 'text-lg',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`${sizeConfig.container} bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300`}>
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="bg-gradient-to-r from-fuchsia-500 to-blue-500 p-4 rounded-full animate-pulse">
              <Clock className="text-white" size={sizeConfig.icon} />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="text-yellow-400 animate-bounce" size={24} />
            </div>
          </div>
        </div>
        <h3 className={`${sizeConfig.title} font-bold text-gray-800 mb-3`}>
          Coming Soon
        </h3>
        <p className={`${sizeConfig.text} text-gray-600 max-w-2xl mx-auto`}>
          {feature} is currently under development. Stay tuned for exciting updates!
        </p>
        <div className="mt-6">
          <span className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full border-2 border-fuchsia-200 text-fuchsia-700 font-semibold">
            <Clock size={20} />
            <span>Launching Soon</span>
          </span>
        </div>
      </div>
    </div>
  );
}
