/**
 * SelectedPowers component - shows powers that have been selected
 */

import { useBuildStore } from '@/stores';
import type { PowerCategory } from '@/stores';
import { PowerColumn, PowerColumnEmpty } from './PowerColumn';
import { PowerCard } from './PowerCard';

interface SelectedPowersProps {
  category: 'primary' | 'secondary';
}

export function SelectedPowers({ category }: SelectedPowersProps) {
  const build = useBuildStore((s) => s.build);
  const removePower = useBuildStore((s) => s.removePower);

  const selection = category === 'primary' ? build.primary : build.secondary;
  const powers = selection.powers;
  const powersetId = selection.id || '';

  const handleRemove = (powerName: string) => {
    removePower(category as PowerCategory, powerName);
  };

  return (
    <PowerColumn
      title={selection.name || `${category === 'primary' ? 'Primary' : 'Secondary'} Powers`}
      subtitle={`${powers.length} powers selected`}
    >
      {powers.length === 0 ? (
        <PowerColumnEmpty message="Select powers from the available list" />
      ) : (
        <div className="space-y-2">
          {powers.map((power) => (
            <PowerCard
              key={power.name}
              power={power}
              category={category}
              powersetId={powersetId}
              onRemove={() => handleRemove(power.name)}
            />
          ))}
        </div>
      )}
    </PowerColumn>
  );
}
