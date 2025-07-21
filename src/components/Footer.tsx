import Link from "next/link";
import Image from "next/image";
import { Twitter, Github } from "lucide-react";

export default function Footer() {
  const twitterHandle = "leomanzanal";
  const githubRepoUrl = "https://github.com/leomanza/palomeitor";
  const creatorName = "@leomanzanal";
  const creatorImageUrl = "/perfil.jpg";
  const creatorUrl = "https://x.com/leomanzanal";

  return (
    <footer className="bg-card border-t shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href={creatorUrl} target="_blank" rel="noopener noreferrer">
            <Image
              src={creatorImageUrl}
              alt={`Foto de perfil de ${creatorName}`}
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
          <div className="text-sm">
            <p className="text-muted-foreground">Creado por</p>
            <a
              href={creatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:text-primary transition-colors"
            >
              {creatorName}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://twitter.com/${twitterHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`Twitter de ${creatorName}`}
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Repositorio de GitHub del proyecto"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://cafecito.app/earthdataprovenance"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              srcSet="https://cdn.cafecito.app/imgs/buttons/button_1.png 1x, https://cdn.cafecito.app/imgs/buttons/button_1_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_1_3.75x.png 3.75x"
              src="https://cdn.cafecito.app/imgs/buttons/button_1.png"
              alt="Invitame un café en cafecito.app"
              className="h-10"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
