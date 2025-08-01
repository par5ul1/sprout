export default function Logo() {
	return (
		<>
			<style>
				{`
          @keyframes grow {
            0% {
              transform-origin: center bottom;
              transform: scale(0);
            }
            80% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
			</style>
			<div className="flex items-baseline">
				<span
					className="block animate-[grow_0.5s] fill-mode-forwards text-6xl delay-500 ease-[cubic-bezier(.7,-0.02,1,.84)]"
					style={{ transform: 'scale(0)' }}
				>
					🌱
				</span>
				<h1 className="-translate-x-5 font-bold text-4xl text-foreground">
					Sprout
				</h1>
			</div>
		</>
	);
}
