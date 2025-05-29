export interface KDomTagSearchResultDto {
  id: string;
  title: string;
  slug: string;
}

export interface UserSearchDto {
  id: number;
  username: string;
}

export interface GlobalSearchResultDto {
  kdoms: KDomTagSearchResultDto[];
  users: UserSearchDto[];
  tags: string[];
}
