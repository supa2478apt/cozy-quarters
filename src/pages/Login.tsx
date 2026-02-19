import { useState } from "react";
import { Building2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // หา user จาก username
      const cleanUsername = username.trim().toLowerCase();

      const q = query(
        collection(db, "users"),
        where("username", "==", cleanUsername)
      );


      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("Username ไม่ถูกต้อง");
      }

      const userData = snapshot.docs[0].data();
      const email = userData.email;

      // login ด้วย email
      await signInWithEmailAndPassword(auth, email, password);

      // redirect ตาม role
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/tenant");
      }

    } catch (err: any) {
      setError(err.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel (เหมือนเดิม) */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col bg-sidebar sidebar-gradient relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal/10" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-teal/8" />
        <div className="absolute top-1/3 left-1/2 w-48 h-48 rounded-full bg-teal/5" />

        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal shadow-glow">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-sidebar-foreground font-bold text-xl">
              ระบบบริหารจัดการหอพัก
            </span>
          </div>

          <div className="mt-auto mb-auto pt-20">
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
              Smart Property<br />Management<br />
              <span className="text-teal">Made Simple</span>
            </h2>
            <p className="text-sidebar-foreground/70 text-lg leading-relaxed">
              Manage multiple buildings, rooms, tenants, utilities, and payments — all in one real-time dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel (เหมือนเดิม) */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">

          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground">
              DormManager
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              ยินดีต้อนรับ
            </h1>
            <p className="text-muted-foreground">
              เข้าสู่ระบบบัญชีของคุณเพื่อดำเนินการต่อ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-light border border-rose/20 text-rose text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-teal hover:bg-teal-dark text-white font-semibold"
              disabled={loading}
            >
              {loading && <Loader2 size={18} className="animate-spin mr-2" />}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}
