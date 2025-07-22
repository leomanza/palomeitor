import Link from "next/link";
import Image from "next/image";
import { Twitter, Github } from "lucide-react";
import ReportIssueDialog from "./ReportIssueDialog";

export default function Footer() {
  const twitterHandle = "leomanzanal";
  const githubRepoUrl = "https://github.com/earthdataprov/Flockia";
  const creatorName = "@leomanzanal";
  const creatorImageUrl = "/perfil.jpg";
  const creatorUrl = "https://x.com/leomanzanal";

  return (
    <footer className="bg-card border-t shadow-sm">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 md:h-16 md:py-0 text-sm">
        {/* Creator Info */}
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
          <div>
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

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ReportIssueDialog />
          <a
            href="https://cafecito.app/earthdataprovenance"
            rel="noopener"
            target="_blank"
          >
            <img
              srcSet="https://cdn.cafecito.app/imgs/buttons/button_3.png 1x, https://cdn.cafecito.app/imgs/buttons/button_3_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_3_3.75x.png 3.75x"
              src="https://cdn.cafecito.app/imgs/buttons/button_3.png"
              alt="Invitame un café en cafecito.app"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
