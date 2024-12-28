// @flow strict
import { Project } from "@/utils/data/projects-data";
import Image from "next/image";
import Link from "next/link";
import GlowCard from "../../helper/glow-card";

function ProjectBlurb({ project }: { project: Project }) {
  return (
    <GlowCard identifier={`project-${project.name.replace(/\s/g, "-")}`} articleClassName="h-full">
      <Link
        target="_blank"
        href={project.link}
        className="p-3 relative text-white block text-center h-full"
      >
        <Image
          src="/blur-23.svg"
          alt="Blur"
          width={1080}
          height={200}
          className="absolute bottom-0 opacity-80"
        />
        <h3 className="text-base sm:text-xl mb-2 font-medium">
          {project.name}
        </h3>
        <p className="text-xs sm:text-sm">{project.description}</p>
      </Link>
    </GlowCard>
  );
}

export default ProjectBlurb;
