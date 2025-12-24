import Link from 'next/link';

interface MikkiTradeLogoProps {
  subsidiary: 'International' | 'Motors' | 'Production';
  href?: string;
  theme?: 'light' | 'dark'; // light = white text, dark = gray text
}

export default function MikkiTradeLogo({ subsidiary, href = '/', theme = 'dark' }: MikkiTradeLogoProps) {
  const mainTextColor = theme === 'light' ? 'text-white' : 'text-gray-900';

  return (
    <Link href={href} className="flex-shrink-0">
      <div className="flex flex-col items-center">
        <span className={`${mainTextColor} font-bold text-sm md:text-base leading-tight`}>Mikki Trade</span>
        <span className="text-[#a235c3] font-semibold text-xs leading-tight">{subsidiary}</span>
      </div>
    </Link>
  );
}
