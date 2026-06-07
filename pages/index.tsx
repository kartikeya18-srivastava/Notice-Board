import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Notice Board</title>
      </Head>
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-gradient mb-4">
            Notice Board
          </h1>
          <p className="text-surface-400 text-lg">
            Coming soon — manage your notices with style.
          </p>
        </div>
      </div>
    </>
  );
}
