import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 4000,
          className: 'rounded-xl font-medium text-slate-800 text-sm border border-slate-100 shadow-lg',
        }} 
      />
    </>
  );
}

