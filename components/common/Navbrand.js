import Link from "next/link";

function Navbrand() {
  return (
    <div>
      <Link href="/">
        <a>
          <img src="/images/hire-me-o-logo-cropped.png" className="h-12 w-auto" />
        </a>
      </Link>
    </div>
  );
}

export default Navbrand;
