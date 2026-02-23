"use client";

import { useState } from "react";
import { Database, Server, Settings, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  testDatabaseConnection,
  saveDatabaseConfig,
  type DatabaseConfig,
} from "@/lib/system-admin-api";

const defaultDbConfig: DatabaseConfig = {
  host: "",
  port: "",
  databaseName: "",
  username: "",
  password: "",
};

function DatabaseSetupSection() {
  const [config, setConfig] = useState<DatabaseConfig>(defaultDbConfig);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const update = (key: keyof DatabaseConfig, value: string) => {
    setConfig((c) => ({ ...c, [key]: value }));
    setMessage({ type: null, text: "" });
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setMessage({ type: null, text: "" });
    try {
      const result = await testDatabaseConnection(config);
      setMessage({
        type: result.success ? "success" : "error",
        text: result.message ?? (result.success ? "Connection successful" : "Connection failed"),
      });
    } catch (e) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Test failed",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    try {
      const result = await saveDatabaseConfig(config);
      setMessage({
        type: result.success ? "success" : "error",
        text: result.message ?? (result.success ? "Saved" : "Save failed"),
      });
    } catch (e) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Save failed",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Database setup</CardTitle>
        <p className="text-sm text-muted-foreground">
          Connection details for the application database. Use &quot;Test
          connection&quot; when the backend is wired.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Host</label>
            <Input
              placeholder="localhost"
              value={config.host}
              onChange={(e) => update("host", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Port</label>
            <Input
              placeholder="5432"
              value={config.port}
              onChange={(e) => update("port", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium leading-none">
              Database name
            </label>
            <Input
              placeholder="app_db"
              value={config.databaseName}
              onChange={(e) => update("databaseName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Username</label>
            <Input
              placeholder="db_user"
              value={config.username}
              onChange={(e) => update("username", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={config.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>
        </div>
        {message.text && (
          <div
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
              message.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            <AlertCircle className="size-4 shrink-0" />
            {message.text}
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={testing}
          >
            <AlertCircle className="size-4" />
            Test connection
          </Button>
          <Button onClick={handleSave}>Save configuration</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ApplicationIntegrationContent() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Application Integration
        </h1>
        <p className="mt-1 text-muted-foreground">
          Database, server, and other configuration. When the backend is ready,
          use the commented API endpoints in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            src/lib/system-admin-api.ts
          </code>{" "}
          to connect.
        </p>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="database" className="gap-2">
            <Database className="size-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="server" className="gap-2">
            <Server className="size-4" />
            Server
          </TabsTrigger>
          <TabsTrigger value="other" className="gap-2">
            <Settings className="size-4" />
            Other config
          </TabsTrigger>
        </TabsList>
        <TabsContent value="database" className="mt-4">
          <DatabaseSetupSection />
        </TabsContent>
        <TabsContent value="server" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Server configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Server and environment settings. Wire to your backend when
                ready.
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Placeholder for server config. Add API calls in{" "}
                <code className="rounded bg-muted px-1.5 py-0.5">
                  system-admin-api.ts
                </code>{" "}
                when the backend is available.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="other" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Other configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Additional integration and config options.
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Placeholder for other config. Connect to backend when ready.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
