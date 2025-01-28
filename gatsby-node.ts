import { GatsbyNode } from "gatsby";
import * as fs from "fs-extra";

export const onPostBuild: GatsbyNode["onPostBuild"] = async () => {
  const sourceDir = "./public";
  const destinationDir = "./docs";

  // Ensure the destination directory exists
  if (fs.existsSync(destinationDir)) {
    await fs.remove(destinationDir);
  }

  // Copy files from public to docs
  await fs.copy(sourceDir, destinationDir);
  console.log(`Successfully copied ${sourceDir} to ${destinationDir}`);

  // Add .nojekyll file
  const noJekyllPath = `${destinationDir}/.nojekyll`;
  fs.writeFileSync(noJekyllPath, "");
  console.log(`Added .nojekyll file to ${destinationDir}`);
};
