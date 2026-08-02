import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import OrderCard from "../components/OrderCard";

function Profile() {
  const user = {
    initials: "OM",
    name: "Olwethu Mtwazi",
    studentNumber: "230036937",
    department: "ICT Department",
  };

  const orders = [
    {
      id: "0001",
      product: "ICT Classic - Custom Print",
      price: "R200",
    },
    {
      id: "0002",
      product: "ICT Crop Top",
      price: "R130",
    },
  ];

  return (
    <div className="profile-page">

      {/* Header */}
      <header className="profile-header">
        <div className="logo">
          Item <span>Hive</span>
        </div>

        <div className="profile-nav">
          My Profile
        </div>
      </header>

      {/* User Banner */}
      <section className="profile-banner">
        <div className="avatar">
          {user.initials}
        </div>

        <h1>{user.name}</h1>

        <p>
          {user.studentNumber} • {user.department}
        </p>
      </section>

      {/* Orders */}
      <section className="profile-section">

       <SectionHeader title="My Orders" />
           {orders.map((order) => (
    <OrderCard
        key={order.id}
        order={order}
    />
))}

      </section>

      {/* Account Settings */}
      <section className="profile-section">

       <SectionHeader title="Account Settings" />

        
<Button>Email Address</Button>

<Button>Size Preference</Button>

<Button>Notifications</Button>

      </section>

      {/* Sign Out */}
      <div className="logout-container">
  <Button>
    Sign Out
  </Button>
</div>

    </div>
  );
}

export default Profile;