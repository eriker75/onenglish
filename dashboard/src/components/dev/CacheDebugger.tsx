"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

/**
 * CacheDebugger Component
 *
 * Componente de desarrollo para visualizar el estado del cache de React Query
 * Útil para verificar que el sistema de precarga esté funcionando correctamente
 *
 * @example
 * // En tu página de desarrollo:
 * import { CacheDebugger } from "@/src/components/dev/CacheDebugger";
 *
 * export default function ChallengePage() {
 *   return (
 *     <>
 *       <YourContent />
 *       {process.env.NODE_ENV === 'development' && <CacheDebugger />}
 *     </>
 *   );
 * }
 */
export function CacheDebugger() {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Get all queries from cache
  const allQueries = queryClient.getQueryCache().getAll();

  // Group queries by type
  const groupedQueries = allQueries.reduce((acc, query) => {
    const key = JSON.stringify(query.queryKey);
    const firstKey = query.queryKey[0] as string;

    if (!acc[firstKey]) {
      acc[firstKey] = [];
    }

    acc[firstKey].push({
      key,
      queryKey: query.queryKey,
      state: query.state,
      dataUpdatedAt: query.state.dataUpdatedAt,
      status: query.state.status,
    });

    return acc;
  }, {} as Record<string, any[]>);

  const toggleExpanded = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-[600px] overflow-auto shadow-lg z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono">
            React Query Cache
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRefreshKey(prev => prev + 1)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Total queries: {allQueries.length}
        </p>
      </CardHeader>

      <CardContent className="space-y-2">
        {Object.entries(groupedQueries).map(([type, queries]) => (
          <Collapsible
            key={`${type}-${refreshKey}`}
            open={expanded[type]}
            onOpenChange={() => toggleExpanded(type)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ({queries.length})
                  </span>
                </div>
                {expanded[type] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-1 pl-2 mt-1">
              {queries.map((query, idx) => (
                <div
                  key={`${query.key}-${idx}`}
                  className="p-2 rounded bg-muted/50 text-xs space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(query.status)}`}
                    />
                    <code className="text-xs break-all">
                      {JSON.stringify(query.queryKey)}
                    </code>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Status: {query.status}</span>
                    <span>Updated: {formatTimestamp(query.dataUpdatedAt)}</span>
                  </div>
                  {query.state.data && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs text-blue-600">
                        View Data
                      </summary>
                      <pre className="mt-1 p-2 bg-background rounded text-[10px] overflow-auto max-h-32">
                        {JSON.stringify(query.state.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}

        {allQueries.length === 0 && (
          <p className="text-xs text-center text-muted-foreground py-4">
            No queries in cache
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Versión simplificada para ver solo las stats
 */
export function CacheStats() {
  const queryClient = useQueryClient();
  const [refreshKey, setRefreshKey] = useState(0);

  const allQueries = queryClient.getQueryCache().getAll();

  const stats = {
    total: allQueries.length,
    success: allQueries.filter(q => q.state.status === 'success').length,
    pending: allQueries.filter(q => q.state.status === 'pending').length,
    error: allQueries.filter(q => q.state.status === 'error').length,
  };

  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-3 shadow-lg z-50">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h3 className="font-mono text-xs font-bold">Cache Stats</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setRefreshKey(prev => prev + 1)}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Total:</span>
          <span className="ml-2 font-bold">{stats.total}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Success:</span>
          <span className="ml-2 font-bold text-green-600">{stats.success}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Pending:</span>
          <span className="ml-2 font-bold text-yellow-600">{stats.pending}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Error:</span>
          <span className="ml-2 font-bold text-red-600">{stats.error}</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">
        Key: {refreshKey}
      </p>
    </div>
  );
}
