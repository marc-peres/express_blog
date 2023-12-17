// export type AvailableResolutionsType = 'P144' | 'P240' | 'P360' | 'P480' | 'P720' | 'P1080' | 'P1440' | 'P2160';
export enum AvailableResolutionsType {
  P144 = 'P144',
  P240 = 'P240',
  P360 = 'P360',
  P480 = 'P480',
  P720 = 'P720',
  P1080 = 'P1080',
  P1440 = 'P1440',
  P2160 = 'P2160',
}

export type VideosDbType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: Array<AvailableResolutionsType>;
};

export type VideoIdParamType = { id: string };

export type PostVideItemType = {
  title: string;
  author: string;
  availableResolutions?: Array<AvailableResolutionsType>;
};

export type PutVideoItemType = {
  title: string;
  author: string;
  availableResolutions: Array<AvailableResolutionsType>;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};
