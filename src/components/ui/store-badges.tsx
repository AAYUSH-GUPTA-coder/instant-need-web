function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zm3.24-2.921c.835-1.012 1.398-2.416 1.246-3.808-1.207.052-2.663.805-3.532 1.818-.775.896-1.454 2.338-1.273 3.703 1.336.104 2.699-.686 3.559-1.713z" />
    </svg>
  );
}

function GooglePlayMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M5 3.5 L19 12 L5 20.5 Z" />
    </svg>
  );
}

export function AppStoreBadge({ href, disabled }: { href: string; disabled?: boolean }) {
  const classes = disabled
    ? "inline-flex items-center gap-2.5 rounded-lg bg-foreground/40 text-background px-4 py-2 cursor-not-allowed"
    : "inline-flex items-center gap-2.5 rounded-lg bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors";
  const content = (
    <>
      <AppleMark className="h-6 w-6 shrink-0" />
      <span className="text-left leading-tight">
        <span className="block text-[10px] opacity-80">Download on the</span>
        <span className="block text-base font-semibold -mt-0.5">App Store</span>
      </span>
    </>
  );
  if (disabled) {
    return (
      <span className={classes} aria-disabled="true">
        {content}
      </span>
    );
  }
  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}

export function GooglePlayBadge({ href, disabled }: { href: string; disabled?: boolean }) {
  const classes = disabled
    ? "inline-flex items-center gap-2.5 rounded-lg bg-foreground/40 text-background px-4 py-2 cursor-not-allowed"
    : "inline-flex items-center gap-2.5 rounded-lg bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors";
  const content = (
    <>
      <GooglePlayMark className="h-6 w-6 shrink-0" />
      <span className="text-left leading-tight">
        <span className="block text-[10px] opacity-80">GET IT ON</span>
        <span className="block text-base font-semibold -mt-0.5">Google Play</span>
      </span>
    </>
  );
  if (disabled) {
    return (
      <span className={classes} aria-disabled="true">
        {content}
      </span>
    );
  }
  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}
