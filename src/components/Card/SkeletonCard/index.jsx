import { Card, Skeleton } from "antd";

const CardSkeleton = () => {
  return (
    <Card className="rounded-2xl shadow-md">
      <Skeleton active />
    </Card>
  );
};

export default CardSkeleton;
