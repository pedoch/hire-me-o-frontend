import Head from "next/head";
import { MainLayout } from "../components/common";
import { User } from "../components/views/me";

function Me() {
  return (
    <MainLayout>
      <Head>
        <title>Me | Hire Me O!</title>
      </Head>
      <div className="w-full h-full flex flex-col items-center">
        <User />
      </div>
    </MainLayout>
  );
}

export default Me;
