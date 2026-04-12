import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, LogOut, RefreshCw, Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GoogleTranslate from "@/components/GoogleTranslate";

interface MarketplaceListing {
  id: string;
  session_id: string | null;
  farmer_name: string;
  phone: string;
  farmer_id: string | null;
  language: string | null;
  location_source: string | null;
  lat: number | null;
  lng: number | null;
  state: string | null;
  district: string | null;
  village: string | null;
  pincode: string | null;
  nearest_mandi: string | null;
  status: string;
  govt_notes: string | null;
  created_at: string;
}

interface MarketplaceCrop {
  id: string;
  listing_id: string;
  crop_id: string | null;
  name: string;
  variety: string | null;
  season: string | null;
  harvest_date: string | null;
  quantity_qtl: number | null;
  grade: string | null;
  moisture_pct: number | null;
  is_organic: boolean | null;
  storage_type: string | null;
  price_per_qtl: number | null;
  negotiable: boolean | null;
  images: any;
  created_at: string;
}

const MarketplaceAdmin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [selectedCrops, setSelectedCrops] = useState<MarketplaceCrop[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
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
        sessionStorage.setItem("mkt_admin_auth", "true");
      } else {
        toast({ title: "Invalid password", variant: "destructive" });
      }
    } catch {
      toast({ title: "Authentication failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    let query = supabase
      .from("marketplace_listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      toast({ title: "Failed to fetch listings", variant: "destructive" });
    } else {
      setListings(data || []);
    }
    setLoading(false);
  };

  const fetchCropsForListing = async (listingId: string) => {
    const { data, error } = await supabase
      .from("marketplace_crops")
      .select("*")
      .eq("listing_id", listingId);
    if (error) {
      toast({ title: "Failed to fetch crops", variant: "destructive" });
      return [];
    }
    return data || [];
  };

  const updateStatus = async (id: string, status: string, notes?: string) => {
    const updateData: { status: string; govt_notes?: string } = { status };
    if (notes !== undefined) updateData.govt_notes = notes;

    const { error } = await supabase
      .from("marketplace_listings")
      .update(updateData)
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: `Listing ${status}` });
      fetchListings();
    }
  };

  const handleApprove = (id: string) => updateStatus(id, "approved");

  const handleReject = (id: string) => {
    const note = prompt("Enter rejection note (optional)") || "";
    updateStatus(id, "rejected", note);
  };

  const viewDetails = async (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    const crops = await fetchCropsForListing(listing.id);
    setSelectedCrops(crops);
    setModalOpen(true);
  };

  useEffect(() => {
    if (authenticated) fetchListings();
  }, [authenticated, statusFilter]);

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem("mkt_admin_auth");
    setPassword("");
  };

  const filtered = listings.filter(
    (l) =>
      l.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.state || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.district || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusBadge = (status: string) => {
    if (status === "approved") return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
    if (status === "rejected") return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="mx-auto h-10 w-10 text-primary mb-2" />
            <CardTitle>Marketplace Admin</CardTitle>
            <p className="text-sm text-muted-foreground">Enter the admin password to manage marketplace listings</p>
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
          <h1 className="text-2xl font-bold text-foreground">🌾 Marketplace Listings</h1>
          <div className="flex gap-2 items-center">
            <GoogleTranslate />
            <Button variant="outline" size="sm" onClick={fetchListings} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by farmer, state, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{filtered.length} listings</span>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Mandi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {listings.length === 0 ? "No marketplace listings yet" : "No matching results"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {new Date(listing.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{listing.farmer_name}</TableCell>
                      <TableCell>{listing.phone}</TableCell>
                      <TableCell>{listing.state || "—"}</TableCell>
                      <TableCell>{listing.district || "—"}</TableCell>
                      <TableCell>{listing.nearest_mandi || "—"}</TableCell>
                      <TableCell>{statusBadge(listing.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => viewDetails(listing)} title="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {listing.status === "pending" && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleApprove(listing.id)} title="Approve" className="text-green-600 hover:text-green-700">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleReject(listing.id)} title="Reject" className="text-red-600 hover:text-red-700">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>🌾 Listing Details</DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">👨‍🌾 Farmer Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span><b>Name:</b> {selectedListing.farmer_name}</span>
                  <span><b>Phone:</b> {selectedListing.phone}</span>
                  <span><b>Aadhaar (last 4):</b> {selectedListing.farmer_id || "—"}</span>
                  <span><b>Language:</b> {selectedListing.language || "en"}</span>
                  <span><b>State:</b> {selectedListing.state || "—"}</span>
                  <span><b>District:</b> {selectedListing.district || "—"}</span>
                  <span><b>Village:</b> {selectedListing.village || "—"}</span>
                  <span><b>Pincode:</b> {selectedListing.pincode || "—"}</span>
                  <span><b>Mandi:</b> {selectedListing.nearest_mandi || "—"}</span>
                  <span><b>Location:</b> {selectedListing.location_source || "manual"}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">🌾 Crops ({selectedCrops.length})</h3>
                {selectedCrops.map((crop) => (
                  <div key={crop.id} className="bg-muted rounded-lg p-3 mb-2">
                    <div className="font-semibold text-sm">
                      🌾 {crop.name} · Grade {crop.grade || "B"} · {crop.quantity_qtl || 0} Qtl
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Variety: {crop.variety || "—"} | Season: {crop.season || "—"} | Harvest: {crop.harvest_date || "—"}
                      <br />
                      Price: ₹{crop.price_per_qtl || "—"}/qtl | Storage: {crop.storage_type || "—"} | Organic: {crop.is_organic ? "Yes" : "No"}
                    </div>
                  </div>
                ))}
                {selectedCrops.length === 0 && <p className="text-sm text-muted-foreground">No crops found</p>}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">📋 Status</h3>
                {statusBadge(selectedListing.status)}
                {selectedListing.govt_notes && (
                  <p className="text-sm text-muted-foreground mt-2 p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                    📝 {selectedListing.govt_notes}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketplaceAdmin;
