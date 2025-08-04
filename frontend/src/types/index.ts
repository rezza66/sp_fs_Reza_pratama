export type User = {
  id: string;
  email: string;
};

export type Project = {
  id: string;
  name: string;
  ownerId: string;
  owner: {
    id: string;
    email: string;
  };
  members: {
    user: {
      id: string;
      email: string;
    };
  }[];
  _count: {
    tasks: number;
  };
};


export type Task = {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee: {
    id: string;
    email: string;
  };
};

export type UserSuggestion = {
  id: string
  email: string
}

export type Member = {
  id: string
  email: string
}