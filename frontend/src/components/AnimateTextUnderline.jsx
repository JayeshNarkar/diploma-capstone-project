export default function ({ text }) {
  return (
    <span
      className="relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] 
         before:bg-gray-300 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 
         hover:before:scale-x-100"
    >
      {text}
    </span>
  );
}
