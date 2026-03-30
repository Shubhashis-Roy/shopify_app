import { Page, Card, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import ChatBotCore from "app/components/ChatBotCore";

export const loader = async ({ request }: { request: Request }) => {
  await authenticate.admin(request);
  return null;
};

export default function AppIndex() {
  return (
    <Page title="Shoes Assistant">
      <Card>
        <BlockStack gap="400">
          <ChatBotCore />
        </BlockStack>
      </Card>
    </Page>
  );
}
