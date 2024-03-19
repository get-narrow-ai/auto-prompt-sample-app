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
            endContent={
              isEditing ? null : (
                <>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="lilac-100"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 h-4 w-4 fill-lilac-100"
                  >
                    <g clipPath="url(#clip0_2543_36827)">
                      <path d="M2.87197 0L2.7016 1.18809C2.58945 1.9727 1.9727 2.58945 1.18809 2.7016L0 2.87197V3.58952L1.18809 3.75989C1.9727 3.87204 2.58945 4.48879 2.7016 5.2734L2.87197 6.46149H3.58952L3.75989 5.2734C3.87204 4.48879 4.48879 3.87204 5.2734 3.75989L6.46149 3.58952V2.87197L5.2734 2.7016C4.48879 2.58945 3.87204 1.9727 3.75989 1.18809L3.58952 0H2.87197ZM11.0768 0L10.9678 0.763516C10.8958 1.26797 10.4996 1.66507 9.99512 1.73707L9.2307 1.84614V2.30768L9.99422 2.41675C10.4987 2.48875 10.8958 2.88494 10.9678 3.3894L11.0768 4.15382H11.5384L11.6475 3.3903C11.7195 2.88584 12.1156 2.48875 12.6201 2.41675L13.3845 2.30768V1.84614L12.621 1.73707C12.1165 1.66507 11.7195 1.26888 11.6475 0.764418L11.5384 0H11.0768ZM19.2357 0.924873C19.0721 0.932574 18.9419 0.982879 18.8508 1.07361C18.8502 1.07421 18.8496 1.07481 18.849 1.07541L0.540862 19.3836C-0.180056 20.1045 -0.180056 21.2741 0.540862 21.995L2.00479 23.459C2.72571 24.1803 3.89443 24.1803 4.61535 23.459L22.9235 5.1508C22.9241 5.15021 22.9247 5.1496 22.9253 5.149C23.1132 4.96104 23.1254 4.6095 22.9598 4.15642C22.7942 3.70333 22.4614 3.17783 22.0201 2.67264C21.5788 2.16746 21.0575 1.71506 20.5481 1.39528C20.0386 1.0755 19.5738 0.908899 19.2357 0.924873ZM19.4124 3.12348C19.8131 3.66556 20.3351 4.18692 20.8773 4.58651L14.3869 11.0768L12.9221 9.61291L19.4124 3.12348ZM18.9229 15.2307L18.7048 16.7586C18.5608 17.7675 17.7675 18.5608 16.7586 18.7048L15.2307 18.9229V19.846L16.7586 20.0642C17.7675 20.2082 18.5608 21.0014 18.7048 22.0104L18.9229 23.5383H19.846L20.0642 22.0104C20.2082 21.0014 21.0014 20.2082 22.0104 20.0642L23.5383 19.846V18.9229L22.0104 18.7048C21.0014 18.5608 20.2082 17.7675 20.0642 16.7586L19.846 15.2307H18.9229Z"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_2543_36827">
                        <rect width="24" height="24" fill="white"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </>
              )
            }
          >
            {isEditing ? "Submit" : "Fix Response"}
          </Button>
        )}
        {edited && (
          <p className="text-xs text-green-500 font-bold align-middle">
            <Spinner size="sm" color="success" className="mr-2 align-middle" />
            Training new prompt via edit!
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AiResponse;
