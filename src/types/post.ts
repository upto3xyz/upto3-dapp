//twitter tweet
export interface PostEntity {
  id: string,
  title?: string,
  summary: string,
  utcTime: Date,
  tags: string[],
  category: string,
  allDay: boolean,

  tweetId: string,
  tweetURL: string,

  startTime?: Date,
  endTime?: Date,
  address?: string
}