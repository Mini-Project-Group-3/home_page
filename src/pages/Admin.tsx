import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lock, LogOut, RefreshCw, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: string;
  scheme_name: string;
  farmer_name: string;
  phone: string;
  email: string | null;
  state: string;
  district: string;
  village: string | null;
  land_area_acres: number | null;
  aadhaar_last_four: string | null;
  message: string | null;
  created_at: string;
}

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin", {
        body: { password },
      });
      if (error) throw error;
      if (data.valid) {
        setAuthenticated(true);
        sessionStorage.setItem("admin_auth", "true");
      } else {
        toast({ title: "Invalid password", variant: "destructive" });
      }
    } catch {
      toast({ title: "Authentication failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("scheme_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to fetch applications", variant: "destructive" });
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) fetchApplications();
  }, [authenticated]);

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    setPassword("");
  };

  const filtered = applications.filter(
    (a) =>
      a.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.scheme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="mx-auto h-10 w-10 text-primary mb-2" />
            <CardTitle>Admin Panel</CardTitle>
            <p className="text-sm text-muted-foreground">Enter the admin password to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Scheme Applications</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, scheme, state, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <span className="text-sm text-muted-foreground">{filtered.length} applications</span>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Scheme</TableHead>
                  <TableHead>Farmer Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Land (acres)</TableHead>
                  <TableHead>Aadhaar (last 4)</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      {applications.length === 0 ? "No applications yet" : "No matching results"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{app.scheme_name}</TableCell>
                      <TableCell>{app.farmer_name}</TableCell>
                      <TableCell>{app.phone}</TableCell>
                      <TableCell>{app.email || "—"}</TableCell>
                      <TableCell>{app.state}</TableCell>
                      <TableCell>{app.district}</TableCell>
                      <TableCell>{app.village || "—"}</TableCell>
                      <TableCell>{app.land_area_acres ?? "—"}</TableCell>
                      <TableCell>{app.aadhaar_last_four || "—"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{app.message || "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
