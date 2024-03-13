import { Card, CardBody, CardFooter, Divider } from "@nextui-org/react";

const UserMessage = ({ message }: any) => {
  return (
    <Card key={message.id} className="whitespace-pre-wrap mt-2">
      <CardBody>
        <p>{message.content}</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <p className="text-xs">
          {"You"} - {message.createdAt?.toLocaleString() || "now"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default UserMessage;
