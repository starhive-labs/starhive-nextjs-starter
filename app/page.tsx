import React from "react";
import Image from "next/image";
import Link from "next/link";

import {createClient, starhiveApiToken, starhiveWorkspaceId} from "@/app/api/ClientFactory";
import {OnboardingStep} from "@/app/components/OnboardingStep";
import {StarhivePage} from "@/app/api/starhive/client/StarhivePage";
import {StarhiveTypeEnriched} from "@/app/api/starhive/client/StarhiveTypeEnriched";
import CodeBlock from "@/app/components/CodeBlock";

export default async function Home() {

    const workspaceIdSetupCompleted = starhiveWorkspaceId() !== undefined
    const apiKeySetupCompleted = starhiveApiToken() !== undefined

    let types: StarhivePage<StarhiveTypeEnriched> | undefined = undefined
    let schemaGenerated = false
    let client
    if (workspaceIdSetupCompleted && apiKeySetupCompleted) {
        client = createClient()
        types = await client.getTypesEnriched();
        if (client.decoders.size > 0) {
            schemaGenerated = true
        }
    }
    const typeCreationCompleted = types !== undefined && types.total > 0

    return (
        <>
            <div className="container mx-auto py-20">
                <Link href="https://www.starhive.com" style={{display: "block"}}>
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width="250"
                        height="10"
                        className="relative"
                    />
                </Link>
                <h1 className="title">Build business apps
                    for <em>any</em> purpose in hours, not weeks</h1>
                <div className="text-2xl md:text-3xl pt-8 font-semibold text-blue-600">
                Starhive + Next.js starter
                </div>
                <div className="paragraph">
                    This is a demo page that helps you get started with your Next.js app using Starhive platform as
                    a backend.
                </div>
                <div className="paragraph">
                    Follow the onboarding steps to set up your workspace, define your types and auto generate domain
                    classes.
                </div>
                <div className="mx-auto">
                    <OnboardingStep title="Create an Account and Workspace" completed={workspaceIdSetupCompleted}>
                        <div className="paragraph">Sign up and create a workspace on <Link
                            href="https://app.starhive.com" className="hover:underline text-blue-600">Starhive</Link>
                        </div>
                        <div className="flex flex-row flex-wrap justify-center">
                            <Image src="/create_acc.png" alt="Create Account" width={500} height={20}
                                   className="rounded-md mx-3 border-gray-300 border-2"/>
                            <Image src="/account_done.png" alt="Account Created" width={700} height={20}
                                   className="rounded-md mx-3 border-gray-300 border-2"/>
                        </div>

                        <div className="paragraph">
                            Copy your workspace id from the URL and set it up as an environment variable.
                        </div>
                        <CodeBlock>
                            {`export STARHIVE_WORKSPACE_ID="workspace id"`}
                        </CodeBlock>
                    </OnboardingStep>

                    <OnboardingStep title="Generate API Key"
                                    completed={workspaceIdSetupCompleted && apiKeySetupCompleted}>
                        <div className="paragraph">
                            Navigate to the workspace settings page. Select Personal access token tab in the menu and
                            create a new token.
                        </div>
                        <div className="flex flex-row flex-wrap justify-center">
                            <Image src="/navigate_settings.png" alt="Workspace settings" width={600} height={200}
                                   className="rounded-md mx-3 border-gray-300 border-2"/>
                            <Image src="/create_token.png" alt="Create token" width={600} height={20}
                                   className="rounded-md mx-3 border-gray-300 border-2"/>
                        </div>
                        <div className="paragraph">
                            Copy your generated api token. Note that this is the only time you can see the token, after
                            closing the popup it will disappear.
                        </div>
                        <div className="paragraph">
                            Set up your api token as an environment variable.
                        </div>
                        <CodeBlock>
                            {`export STARHIVE_API_TOKEN="api token"`}
                        </CodeBlock>
                    </OnboardingStep>

                    <OnboardingStep title="Create Spaces and Types" completed={typeCreationCompleted}>
                        <div className="paragraph">Create some spaces and types for your data model on <Link
                            href="https://app.starhive.com" className="hover:underline text-blue-600">Starhive</Link>
                        </div>
                        <div className="flex flex-row flex-wrap justify-center">
                            <Image src="/create_types.png" alt="Create Spaces and Types" width={700} height={200}
                                   className="rounded-md border-gray-300 border-2"/>
                        </div>
                    </OnboardingStep>

                    <OnboardingStep title="Generate TypeScript Schema" completed={schemaGenerated}>
                        <div className="paragraph">
                            Navigate to API Connectors extension. Select your space and TypeScript language. Then press
                            generate button.
                        </div>
                        <div className="flex flex-row flex-wrap justify-center">
                            <Image src="/api_connectors.png" alt="Navigate to API Connectors extension" width={700}
                                   height={20}
                                   className="rounded-md mx-3 border-gray-300 border-2"/>
                            <Image src="/generate_schema.png" alt="Generate Schema" width={700} height={20}
                                   className="rounded-md mx-3 border-gray-300 border-2"/>
                        </div>


                        <div className="paragraph">
                            In the generated archive you get a sample typescript project.
                        </div>
                        <div className="paragraph">
                            Copy files from <span className="path-highlight">src/io/starhive/schema</span> of the sample
                            project into <span className="path-highlight">app/api/starhive/schema</span>
                            catalog in this project
                        </div>

                        <Image src="/file_tree.png" alt="Generate Schema" width={200} height={20}
                               className="rounded-md mx-3 border-gray-300 border-2"/>

                        <div className="paragraph">
                            Go to ClientFactory.ts and replace <span
                            className="path-highlight">new Map()</span> with <span
                            className="path-highlight">JSON_DECODERS</span> constant imported from the schema
                            directory.
                        </div>

                        <div className="paragraph">
                            This would allow you to use domain types in your code without having to manually map type
                            and
                            attribute ids in your code.
                        </div>

                        <CodeBlock>
                            {`
import {JSON_DECODERS} from "@/app/api/starhive/schema/JsonDecoders";                              
                              
//return new StarhiveClient(starhiveApiToken()!, starhiveWorkspaceId()!, new Map())

return new StarhiveClient(starhiveApiToken()!, starhiveWorkspaceId()!, JSON_DECODERS)
                              `}
                        </CodeBlock>
                    </OnboardingStep>

                    <OnboardingStep title="Start Building" completed={false}>
                        <div className="paragraph">
                            Start writing your custom code to interact with the API.
                        </div>
                        <div className="paragraph">
                            Create an object using builder
                        </div>
                        <CodeBlock>
                            {`
    const product = await client.createObject(
        Product.builder()
            .name("Potato Chips")
            .inStock(true)
            .price(3.99)
            .build()
    )
                              `}
                        </CodeBlock>

                        <div className="paragraph">
                            Search for objects
                        </div>
                        <CodeBlock>
                            {`
    const products: StarhivePage<Product> = await client!.search(Product.TYPE_ID, "");
    products.result.forEach(product => {
        console.log(product.getName(), product.getPrice())
    })
                              `}
                        </CodeBlock>
                        <div className="paragraph">
                            Patch objects
                        </div>
                        <CodeBlock>
                            {`
    const toPatch = products.result.map(product => {
        return product
            .toBuilder()
            .price(product.getPrice()! + 10)
            .build()
    });
    await client!.createOrUpdateObjectsInBulk(toPatch)
                              `}
                        </CodeBlock>
                        <div className="paragraph">
                            For more information please refer to the <Link
                            href="https://help.starhive.com/space/DOC" className="hover:underline text-blue-600">official
                            documentation page</Link>
                        </div>
                    </OnboardingStep>
                </div>
            </div>
        </>
    );
}
