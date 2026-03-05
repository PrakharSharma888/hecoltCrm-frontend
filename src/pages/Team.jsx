import React, { useState, useEffect } from "react";
import { api } from "../services/api";

const Team = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await api.getUsers();
            setTeam(data || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setTeam([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full overflow-y-auto p-8 pointer-events-none">
                <div className="max-w-7xl mx-auto flex flex-col gap-6 animate-pulse">
                    <div className="w-1/3 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white dark:bg-[#1c142e] border border-gray-100 dark:border-[#2d2445] rounded-xl p-6 h-48 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0"></div>
                                <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded max-w-xs mt-2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                            Team Members
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            View all team members on the Hecolt CRM portal
                        </p>
                    </div>
                </div>

                {/* Team Grid */}
                {team.length === 0 ? (
                    <div className="bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">
                            groups
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            No team members found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            There are currently no users registered on the portal.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {team.map((member) => (
                            <div
                                key={member._id || member.id}
                                className="bg-white dark:bg-[#1c142e] border border-gray-200 dark:border-[#2d2445] rounded-xl p-6 hover:border-primary/50 transition-all flex flex-col items-center text-center gap-4 group"
                            >
                                {/* Avatar Placeholder */}
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl uppercase group-hover:bg-primary group-hover:text-white transition-colors">
                                    {(member.email || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                {/* Email (only field requested) */}
                                <div className="flex flex-col gap-1 w-full relative">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate" title={member.email}>
                                        {member.email?.split('@')[0] || "User"}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 overflow-hidden">
                                        <span className="material-symbols-outlined text-[16px] shrink-0">
                                            mail
                                        </span>
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                </div>

                                {/* Role Badge if available */}
                                {member.role && (
                                    <div className="mt-2 text-xs font-bold px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full capitalize">
                                        {member.role}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;
