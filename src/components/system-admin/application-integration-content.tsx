"use client";

import { useState, useEffect } from "react";
import { Database, Server, Settings, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchDatabaseConfig,
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

/** If backend returns a masked password, treat as empty so user can type a new one. */
function normalizeFetchedConfig(raw: DatabaseConfig): DatabaseConfig {
  const password = raw.password && !/^\*+$/.test(raw.password) ? raw.password : "";
  return {
    host: raw.host ?? "",
    port: raw.port ?? "",
    databaseName: raw.databaseName ?? "",
    username: raw.username ?? "",
    password,
  };
}

function DatabaseSetupSection() {
  const [config, setConfig] = useState<DatabaseConfig>(defaultDbConfig);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    fetchDatabaseConfig()
      .then((fetched) => {
        if (cancelled) return;
        if (fetched) setConfig(normalizeFetchedConfig(fetched));
        setLoadError(null);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load configuration.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (key: keyof DatabaseConfig, value: string) => {
    setConfig((c) => ({ ...c, [key]: value }));
    setMessage({ type: null, text: "" });
    setLoadError(null);
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
    setSaving(true);
    setMessage({ type: null, text: "" });
    try {
      const result = await saveDatabaseConfig(config);
      setMessage({
        type: result.success ? "success" : "error",
        text: result.message ?? (result.success ? "Configuration saved" : "Save failed"),
      });
    } catch (e) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  const busy = loading || testing || saving;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Database setup</CardTitle>
        <p className="text-sm text-muted-foreground">
          Connection details for the application database. Test the connection before saving.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Loading configuration…</span>
          </div>
        ) : (
          <>
            {loadError && (
              <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                <AlertCircle className="size-4 shrink-0" />
                {loadError} You can still edit and save below.
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Host</label>
                <Input
                  placeholder="localhost"
                  value={config.host}
                  onChange={(e) => update("host", e.target.value)}
                  disabled={busy}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Port</label>
                <Input
                  placeholder="5432"
                  value={config.port}
                  onChange={(e) => update("port", e.target.value)}
                  disabled={busy}
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
                  disabled={busy}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Username</label>
                <Input
                  placeholder="db_user"
                  value={config.username}
                  onChange={(e) => update("username", e.target.value)}
                  disabled={busy}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Password</label>
                <Input
                  type="password"
                  placeholder="Leave blank to keep existing"
                  value={config.password}
                  onChange={(e) => update("password", e.target.value)}
                  disabled={busy}
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
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={testing || saving}
              >
                {testing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Testing…
                  </>
                ) : (
                  <>
                    <AlertCircle className="size-4" />
                    Test connection
                  </>
                )}
              </Button>
              <Button onClick={handleSave} disabled={saving || loading}>
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save configuration"
                )}
              </Button>
            </div>
          </>
        )}
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
          Database, server, and other configuration. Load and save settings from the backend.
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
