declare type Point = [number, number];
declare type Polygon = Point[];

declare namespace Express {
  interface Request {
    session: import('express-session').Session &
      Partial<import('express-session').SessionData> &
      Partial<{
        start: number;
        end: number;
        polygons: {
          [id: string]: {
            _id: import('mongoose').Types.ObjectId;
            name: string;
            isFound: boolean;
          };
        };
      }>;
  }
}
