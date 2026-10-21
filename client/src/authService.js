import { supabase } from './supabaseClient.js';

export const ADMIN_EMAIL = 'prince4sharmaa123@gmail.com';

export function isAdmin(email) {
  if (!email) return false;
  return email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
}

/**
 * Fetch the master approvals registry from Supabase
 */
export async function getApprovalsRegistry() {
  try {
    const { data, error } = await supabase
      .from('spins')
      .select('content')
      .eq('id', 'user_approvals')
      .maybeSingle();

    if (!error && data?.content) {
      return data.content;
    }
  } catch (err) {
    console.warn('Error reading approvals registry:', err);
  }

  return {
    admin: ADMIN_EMAIL,
    approved_emails: [ADMIN_EMAIL],
    pending_users: []
  };
}

/**
 * Save updated registry to Supabase
 */
export async function saveApprovalsRegistry(registry) {
  const { error } = await supabase.from('spins').upsert({
    id: 'user_approvals',
    title: 'User Approvals Registry',
    author: 'System',
    content: registry,
    updated_at: new Date().toISOString()
  });

  if (error) {
    throw new Error('Failed to update approvals in Supabase: ' + error.message);
  }

  return registry;
}

/**
 * Check if the current user is approved
 */
export async function checkUserApproval(email) {
  if (!email) return { isApproved: false, isAdmin: false };

  const cleanEmail = email.toLowerCase().trim();

  // Super Admin is always approved
  if (isAdmin(cleanEmail)) {
    return { isApproved: true, isAdmin: true };
  }

  const registry = await getApprovalsRegistry();
  const approvedList = (registry.approved_emails || []).map(e => e.toLowerCase().trim());

  if (approvedList.includes(cleanEmail)) {
    return { isApproved: true, isAdmin: false };
  }

  // If not approved, check if already in pending. If not, add them automatically
  const pending = registry.pending_users || [];
  const alreadyPending = pending.some(u => (typeof u === 'string' ? u : u.email).toLowerCase().trim() === cleanEmail);

  if (!alreadyPending) {
    pending.unshift({
      email: cleanEmail,
      requested_at: new Date().toISOString()
    });
    registry.pending_users = pending;
    try {
      await saveApprovalsRegistry(registry);
    } catch (e) {
      console.warn('Could not auto-add to pending list:', e);
    }
  }

  return { isApproved: false, isAdmin: false };
}

/**
 * Admin approves a user
 */
export async function approveUser(targetEmail) {
  const cleanEmail = targetEmail.toLowerCase().trim();
  const registry = await getApprovalsRegistry();

  const approvedList = (registry.approved_emails || []).map(e => e.toLowerCase().trim());
  if (!approvedList.includes(cleanEmail)) {
    approvedList.push(cleanEmail);
  }

  // Remove from pending
  const pending = (registry.pending_users || []).filter(u => {
    const e = typeof u === 'string' ? u : u.email;
    return e.toLowerCase().trim() !== cleanEmail;
  });

  registry.approved_emails = approvedList;
  registry.pending_users = pending;

  return await saveApprovalsRegistry(registry);
}

/**
 * Admin revokes a user
 */
export async function revokeUser(targetEmail) {
  const cleanEmail = targetEmail.toLowerCase().trim();
  if (isAdmin(cleanEmail)) {
    throw new Error('Cannot revoke access for the Super Admin.');
  }

  const registry = await getApprovalsRegistry();
  registry.approved_emails = (registry.approved_emails || []).filter(
    e => e.toLowerCase().trim() !== cleanEmail
  );

  return await saveApprovalsRegistry(registry);
}

/**
 * Admin rejects / dismisses a pending request
 */
export async function dismissPendingUser(targetEmail) {
  const cleanEmail = targetEmail.toLowerCase().trim();
  const registry = await getApprovalsRegistry();
  registry.pending_users = (registry.pending_users || []).filter(u => {
    const e = typeof u === 'string' ? u : u.email;
    return e.toLowerCase().trim() !== cleanEmail;
  });

  return await saveApprovalsRegistry(registry);
}
