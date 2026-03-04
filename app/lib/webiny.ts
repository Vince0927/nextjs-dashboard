import axios from "axios";

interface APIOptions<TVariables = Record<string, any>> {
  variables?: TVariables;
  revalidate?: number;
}

const getApiEndpoint = (
  type: "main" | "read" | "manage" | "preview" | "file",
): string => {
  const endpoints: Record<
    "main" | "read" | "manage" | "preview" | "file",
    string
  > = {
    main: "/graphql",
    read: "/cms/read/en-US",
    manage: "/cms/manage/en-US",
    preview: "/cms/preview/en-US",
    file: "/files",
  };

  return endpoints[type];
};

// generic GraphQL client for Webiny CMS
const webinyClient = async <TData, TVariables = Record<string, any>>(
  type: "main" | "read" | "manage" | "preview" | "file",
  query: string,
  { variables }: APIOptions<TVariables> = {},
): Promise<TData> => {
  try {
    const url = process.env.NEXT_PUBLIC_WEBINY_API_URL as string;
    const bearer = `Bearer ${
      process.env.NEXT_PUBLIC_WEBINY_API_SECRET as string
    }`;
    const endpoint = getApiEndpoint(type);

    const { data } = await axios.post(
      url + endpoint,
      { query, variables },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          Authorization: bearer,
        },
        timeout: 60000,
      },
    );

    if (data.errors) {
      console.log("Webiny API Errors:", JSON.stringify(data.errors, null, 2));
      throw new Error(data.errors[0]?.message || "Unknown API error");
    }

    return data.data;
  } catch (error: any) {
    console.error("API failed:", error.response?.data || error.message);
    throw error;
  }
};

export { webinyClient };
