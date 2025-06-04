import React from "react";

interface Props {
  title: string;
  description: string;
}

const PageHeader: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight"> {title} </h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default PageHeader;
