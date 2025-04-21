import React, { useEffect, useState } from 'react';
import { Recycle, TreePine, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const stats = [
  {
    icon: Recycle,
    value: 50000,
    labelKey: 'stats.recycled',
    suffix: '+',
  },
  {
    icon: TreePine,
    value: 25000,
    labelKey: 'stats.co2',
    suffix: '+',
  },
  {
    icon: Users,
    value: 100,
    labelKey: 'stats.clients',
    suffix: '+',
  },
];

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="text-4xl md:text-5xl font-bold">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function Stats() {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-[#0056b3] text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map(({ icon: Icon, value, labelKey, suffix }) => (
            <div
              key={labelKey}
              className="text-center"
            >
              <Icon className="w-12 h-12 mx-auto mb-4" />
              <Counter value={value} suffix={suffix} />
              <p className="mt-2 text-lg">{t(labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}