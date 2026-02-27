interface AuthInfoProps {
  title: string;
  description: string;
}

const AuthInfo = ({ title, description }: AuthInfoProps) => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 flex-col justify-between p-12 text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3 text-xl font-bold tracking-tight">
        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
          <span className="font-black text-xl">PM</span>
        </div>
        Project Management
      </div>

      <div className="relative z-10 max-w-lg">
        <h1 className="text-4xl font-extrabold leading-tight mb-6 tracking-tight">
          {title}
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">{description}</p>
      </div>

      <div className="relative z-10 text-sm text-zinc-500 font-medium">
        © {new Date().getFullYear()} Project Management. All rights reserved.
      </div>
    </div>
  );
};

export default AuthInfo;
