
import { useEffect, useState } from "react";

import {
    Activity,
    Server,
    Database,
    Cpu,
    RefreshCw,
    ShieldCheck,
    Bot,
    Radio,
    CircleAlert,
    CheckCircle2,
    Clock3,
    Terminal
} from "lucide-react";

import {
    getInfrastructureOverview
} from "./services/api";

import "./App.css";


function App() {

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ---------------------------------
    // LOAD INFRASTRUCTURE DATA
    // ---------------------------------

    const loadDashboard = async () => {

        setLoading(true);

        setError("");

        try {

            const result =
                await getInfrastructureOverview();

            setData(result);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    };


    // ---------------------------------
    // INITIAL API CALL
    // ---------------------------------

    useEffect(() => {

        loadDashboard();

    }, []);


    // ---------------------------------
    // STATUS CLASS
    // ---------------------------------

    const getStatusClass = (status) => {

        if (
            status === "healthy" ||
            status === "configured"
        ) {

            return "healthy";

        }

        if (
            status === "degraded" ||
            status === "unavailable"
        ) {

            return "degraded";

        }

        return "pending";

    };


    const healthyServices =
        data?.services.filter(
            service => service.status === "healthy"
        ).length ?? 0;


    return (

        <div className="app-container">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="brand">

                    <div className="brand-icon">
                        <ShieldCheck size={25} />
                    </div>

                    <div>
                        <h2>SENTINEL</h2>
                        <span>AI INFRASTRUCTURE</span>
                    </div>

                </div>


                <div className="nav-section">

                    <p className="nav-label">
                        WORKSPACE
                    </p>

                    <div className="nav-item active">
                        <Activity size={18} />
                        Overview
                    </div>

                    <div className="nav-item">
                        <CircleAlert size={18} />
                        Incidents
                    </div>

                    <div className="nav-item">
                        <Bot size={18} />
                        AI Agents
                    </div>

                    <div className="nav-item">
                        <Server size={18} />
                        Infrastructure
                    </div>

                    <div className="nav-item">
                        <Terminal size={18} />
                        Logs
                    </div>

                </div>


                <div className="sidebar-bottom">

                    <div className="environment">

                        <span className="environment-dot"></span>

                        LOCAL ENVIRONMENT

                    </div>

                    <span>
                        SENTINEL AI v0.1.0
                    </span>

                </div>

            </aside>


            {/* MAIN CONTENT */}

            <main className="main-content">

                <header className="topbar">

                    <div>

                        <h1>
                            Infrastructure Overview
                        </h1>

                        <p>
                            Monitor and manage your infrastructure
                        </p>

                    </div>


                    <button
                        className="refresh-button"
                        onClick={loadDashboard}
                        disabled={loading}
                    >

                        <RefreshCw
                            size={16}
                            className={loading ? "spin" : ""}
                        />

                        Refresh

                    </button>

                </header>


                {/* WELCOME SECTION */}

                <section className="welcome-section">

                    <div>

                        <span className="eyebrow">
                            AUTONOMOUS SRE CONTROL PLANE
                        </span>

                        <h2>
                            Infrastructure at a glance.
                        </h2>

                        <p>
                            Your intelligent infrastructure
                            monitoring workspace.
                        </p>

                    </div>

                    <div className="welcome-icon">
                        <Activity size={48} />
                    </div>

                </section>


                {/* ERROR MESSAGE */}

                {error && (

                    <div className="error-banner">

                        <CircleAlert size={18} />

                        {error}

                    </div>

                )}


                {/* STATISTICS */}

                <section className="stats-grid">


                    <div className="stat-card">

                        <div className="stat-top">

                            <span>Infrastructure</span>

                            <Activity size={20} />

                        </div>

                        <h2>
                            {loading
                                ? "..."
                                : data?.overall_status ?? "Unknown"
                            }
                        </h2>

                        <span className="stat-description">
                            Overall system health
                        </span>

                    </div>


                    <div className="stat-card">

                        <div className="stat-top">

                            <span>Services</span>

                            <Server size={20} />

                        </div>

                        <h2>
                            {data
                                ? `${healthyServices}/3`
                                : "--"
                            }
                        </h2>

                        <span className="stat-description">
                            Operational services
                        </span>

                    </div>


                    <div className="stat-card">

                        <div className="stat-top">

                            <span>AI Agents</span>

                            <Bot size={20} />

                        </div>

                        <h2>
                            {data?.agents.count ?? "--"}
                        </h2>

                        <span className="stat-description">
                            Registered agents
                        </span>

                    </div>


                    <div className="stat-card">

                        <div className="stat-top">

                            <span>LLM Provider</span>

                            <Cpu size={20} />

                        </div>

                        <h2>
                            {data?.llm.configured
                                ? "Ready"
                                : "Pending"
                            }
                        </h2>

                        <span className="stat-description">
                            Groq integration
                        </span>

                    </div>

                </section>


                {/* SERVICE HEALTH */}

                <section className="content-section">

                    <div className="section-heading">

                        <div>

                            <h2>Service Health</h2>

                            <p>
                                Current infrastructure component status
                            </p>

                        </div>

                        <Radio size={20} />

                    </div>


                    <div className="service-list">

                        {data?.services.map(service => (

                            <div
                                className="service-row"
                                key={service.name}
                            >

                                <div className="service-icon">

                                    {service.name === "MongoDB"
                                        ? <Database size={20} />
                                        : service.name === "Redis"
                                            ? <Clock3 size={20} />
                                            : <Server size={20} />
                                    }

                                </div>


                                <div className="service-info">

                                    <h3>{service.name}</h3>

                                    <p>{service.description}</p>

                                </div>


                                <span className={
                                    `status-badge ${
                                        getStatusClass(service.status)
                                    }`
                                }>

                                    {service.status === "healthy"
                                        ? <CheckCircle2 size={14} />
                                        : <CircleAlert size={14} />
                                    }

                                    {service.status}

                                </span>

                            </div>

                        ))}


                        {loading && (

                            <p className="empty-state">
                                Loading infrastructure status...
                            </p>

                        )}

                    </div>

                </section>


                {/* AI OPERATIONS */}

                <section className="content-section">

                    <div className="section-heading">

                        <div>

                            <h2>AI Operations</h2>

                            <p>
                                Agent orchestration status
                            </p>

                        </div>

                        <Bot size={20} />

                    </div>


                    <div className="agent-panel">

                        <div className="agent-avatar">

                            <Bot size={27} />

                        </div>


                        <div>

                            <h3>Agent Orchestrator</h3>

                            <p>
                                Waiting for agent implementation
                            </p>

                        </div>


                        <span className="status-badge pending">
                            NOT CONFIGURED
                        </span>

                    </div>

                </section>


                <footer>
                    SENTINEL AI · Autonomous Infrastructure Intelligence
                </footer>

            </main>

        </div>

    );

}


export default App;
