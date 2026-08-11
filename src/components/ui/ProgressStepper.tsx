import { Check, User } from 'lucide-react';
import { cn } from '../../lib/cn';

type StepState = 'done' | 'active' | 'pending';

function StepLine({ filled }: { filled: boolean }) {
  return (
    <div
      className={cn('h-0.5 flex-1 min-w-[2rem] max-w-[4rem] sm:min-w-[3rem]', filled ? 'bg-primary' : 'bg-gray-200')}
    />
  );
}

function StepNode({
  state,
  icon = 'check',
  label,
}: {
  state: StepState;
  icon?: 'check' | 'dot' | 'user';
  label?: string;
}) {
  if (state === 'done') {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary shadow-sm">
        <Check className="text-white" size={16} strokeWidth={3} />
      </div>
    );
  }

  if (state === 'active' && icon === 'dot') {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        <div className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-orange-100" />
      </div>
    );
  }

  if (state === 'active') {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm">
        {label ?? '4'}
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
      {icon === 'user' || !label ? (
        <User className="text-gray-400" size={16} />
      ) : (
        <span className="text-sm font-medium text-gray-400">{label}</span>
      )}
    </div>
  );
}

/** 4-step onboarding bar (language → auth → business → KYC) */
export function OnboardingStepper({ currentStep }: { currentStep: 1 | 2 | 3 | 4 }) {
  return (
    <div className="mb-8 flex items-center justify-center px-2">
      <div className="flex w-full max-w-md items-center justify-center">
        {[1, 2, 3, 4].map((step, idx) => {
          const state: StepState =
            step < currentStep ? 'done' : step === currentStep ? 'active' : 'pending';
          return (
            <div key={step} className="flex items-center">
              <StepNode
                state={state}
                label={String(step)}
                icon={step === 4 && state === 'pending' ? 'user' : 'check'}
              />
              {idx < 3 && <StepLine filled={step < currentStep} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** KYC document upload progress (matches identity proof prototype) */
export function KycDocProgress({ hasPan, hasAadhaar }: { hasPan: boolean; hasAadhaar: boolean }) {
  const stage2State: StepState = hasPan ? 'done' : 'active';
  const stage3State: StepState = hasAadhaar ? 'done' : hasPan ? 'active' : 'pending';

  return (
    <div className="mb-8 flex items-center justify-center px-2">
      <div className="flex w-full max-w-xs items-center sm:max-w-sm">
        <StepNode state="done" />
        <StepLine filled />
        <StepNode state={stage2State} icon={stage2State === 'active' ? 'dot' : 'check'} />
        <StepLine filled={hasPan} />
        <StepNode
          state={stage3State}
          icon={stage3State === 'active' ? 'dot' : stage3State === 'done' ? 'check' : 'user'}
        />
      </div>
    </div>
  );
}
