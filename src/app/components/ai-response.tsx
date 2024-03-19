import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Spinner,
  Skeleton,
} from "@nextui-org/react";
import { Message } from "ai/react";
import { useState, useCallback } from "react";
import WandSvg from "../svgs/wand";

const AiResponse = ({
  message,
  onTrain,
}: {
  message: Message;
  onTrain: (generation: string, correction: string) => any;
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [edited, setEdited] = useState<boolean>(false);
  const [content, setContent] = useState<string>(message.content);

  const onClick = useCallback(() => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setEdited(true);
      onTrain(message.content, content);
    }
  }, [isEditing, content]);

  if (!content.length) {
    return (
      <Card key={message.id} className="whitespace-pre-wrap mt-2">
        <CardBody>
          <Skeleton className="rounded-lg">
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Voluptate aut quia est qui cupiditate magnam laboriosam atque non.
              Eaque quod, fugit minus voluptate praesentium quia nemo optio
              libero quae exercitationem.
            </p>
          </Skeleton>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between">
          <p className="text-xs">
            {"LLM"} - {message.createdAt?.toLocaleString() || "now"}
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card key={message.id} className="whitespace-pre-wrap mt-2">
      <CardBody>
        <p
          contentEditable={isEditing}
          onBlur={(e: any) => setContent(e.target.textContent || "")}
          className="p-2"
        >
          {content}
        </p>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between">
        <p className="text-xs">
          {"LLM"} - {message.createdAt?.toLocaleString() || "now"}
        </p>
        {!edited && (
          <Button
            radius="sm"
            size="sm"
            className="ml-auto hover:cursor-pointer"
            onClick={onClick}
            endContent={isEditing ? null : <WandSvg />}
          >
            {isEditing ? "Submit" : "Fix Response"}
          </Button>
        )}
        {edited && (
          <p className="text-xs text-green-500 font-bold align-middle">
            <Spinner size="sm" color="success" className="mr-2 align-middle" />
            Training new prompt from your edit...
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AiResponse;
