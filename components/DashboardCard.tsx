import React from 'react';

interface ModuleCardProps {
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  onClick: () => void;
}

const colorMap: { [key: string]: { bg: string; text: string; hoverBg: string; } } = {
    // Purples/Pinks
    purple: { bg: 'bg-purple-600', text: 'text-white', hoverBg: 'hover:bg-purple-700' },
    violet: { bg: 'bg-violet-600', text: 'text-white', hoverBg: 'hover:bg-violet-700' },
    indigo: { bg: 'bg-indigo-600', text: 'text-white', hoverBg: 'hover:bg-indigo-700' },
    fuchsia:{ bg: 'bg-fuchsia-600',text: 'text-white', hoverBg: 'hover:bg-fuchsia-700' },
    pink:   { bg: 'bg-pink-500',   text: 'text-white', hoverBg: 'hover:bg-pink-600' },
    rose:   { bg: 'bg-rose-500',   text: 'text-white', hoverBg: 'hover:bg-rose-600' },
    
    // Blues/Greens
    blue:   { bg: 'bg-blue-600',   text: 'text-white', hoverBg: 'hover:bg-blue-700' },
    'light-blue': { bg: 'bg-blue-400', text: 'text-white', hoverBg: 'hover:bg-blue-500' },
    sky:    { bg: 'bg-sky-500',    text: 'text-white', hoverBg: 'hover:bg-sky-600' },
    cyan:   { bg: 'bg-cyan-500',   text: 'text-white', hoverBg: 'hover:bg-cyan-600' },
    teal:   { bg: 'bg-teal-500',   text: 'text-white', hoverBg: 'hover:bg-teal-600' },
    emerald:{ bg: 'bg-emerald-500',text: 'text-white', hoverBg: 'hover:bg-emerald-600' },
    green:  { bg: 'bg-green-600',  text: 'text-white', hoverBg: 'hover:bg-green-700' },
    'dark-green': { bg: 'bg-green-700', text: 'text-white', hoverBg: 'hover:bg-green-800' },

    // Yellows/Reds
    lime:   { bg: 'bg-lime-400',   text: 'text-lime-900', hoverBg: 'hover:bg-lime-500' },
    yellow: { bg: 'bg-yellow-400', text: 'text-yellow-900', hoverBg: 'hover:bg-yellow-500' },
    amber:  { bg: 'bg-amber-400',  text: 'text-amber-900', hoverBg: 'hover:bg-amber-500' },
    orange: { bg: 'bg-orange-500', text: 'text-white', hoverBg: 'hover:bg-orange-600' },
    red:    { bg: 'bg-red-600',    text: 'text-white', hoverBg: 'hover:bg-red-700' },
    
    // Grays
    slate:  { bg: 'bg-slate-500',  text: 'text-white', hoverBg: 'hover:bg-slate-600' },
    gray:   { bg: 'bg-gray-500',   text: 'text-white', hoverBg: 'hover:bg-gray-600' },
    zinc:   { bg: 'bg-zinc-500',   text: 'text-white', hoverBg: 'hover:bg-zinc-600' },
    neutral:{ bg: 'bg-neutral-500',text: 'text-white', hoverBg: 'hover:bg-neutral-600' },
    stone:  { bg: 'bg-stone-500',  text: 'text-white', hoverBg: 'hover:bg-stone-600' },
};


const DashboardCard: React.FC<ModuleCardProps> = ({ title, icon: Icon, color, description, onClick }) => {
  const styles = colorMap[color] || colorMap.gray;

  return (
    <div 
        className={`flex flex-col items-center justify-center text-center p-4 rounded-lg cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 aspect-square ${styles.bg} ${styles.text} ${styles.hoverBg}`}
        onClick={onClick}
        title={description}
    >
      <Icon className={`h-10 w-10 mb-3`} />
      <h3 className={`text-sm font-bold`}>{title}</h3>
    </div>
  );
};

export default DashboardCard;