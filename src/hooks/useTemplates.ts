// src/hooks/useTemplates.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OpenCodeConfig } from '@/types/config';
import { nanoid } from 'nanoid';

/**
 * User Template Interface
 * Represents a saved configuration template with metadata
 */
export interface UserTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  config: OpenCodeConfig;
}

/**
 * Template Store State
 */
interface TemplateState {
  // User templates
  userTemplates: UserTemplate[];

  // Actions
  saveAsTemplate: (name: string, description: string, config: OpenCodeConfig) => void;
  deleteTemplate: (id: string) => void;
  importTemplate: (json: string) => UserTemplate;
  exportTemplate: (id: string) => string;
  exportAllTemplates: () => string;
  importAllTemplates: (json: string) => void;
  updateTemplate: (id: string, updates: Partial<Omit<UserTemplate, 'id' | 'createdAt'>>) => void;
  duplicateTemplate: (id: string, newName?: string) => UserTemplate;
  clearAllTemplates: () => void;
}

/**
 * Template Store with Zustand + Persist
 * Stores user templates in localStorage
 */
export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      userTemplates: [],

      /**
       * Save current config as a new template
       */
      saveAsTemplate: (name, description, config) => {
        const newTemplate: UserTemplate = {
          id: nanoid(),
          name,
          description,
          createdAt: new Date().toISOString(),
          config: { ...config },
        };

        set((state) => ({
          userTemplates: [...state.userTemplates, newTemplate],
        }));
      },

      /**
       * Delete a template by ID
       */
      deleteTemplate: (id) => {
        set((state) => ({
          userTemplates: state.userTemplates.filter((t) => t.id !== id),
        }));
      },

      /**
       * Import a single template from JSON string
       * Returns the imported template
       */
      importTemplate: (json) => {
        try {
          const parsed = JSON.parse(json);

          // Validate template structure
          if (!parsed.name || !parsed.config) {
            throw new Error('Invalid template format: missing name or config');
          }

          const newTemplate: UserTemplate = {
            id: nanoid(),
            name: parsed.name,
            description: parsed.description || '',
            createdAt: parsed.createdAt || new Date().toISOString(),
            config: parsed.config,
          };

          set((state) => ({
            userTemplates: [...state.userTemplates, newTemplate],
          }));

          return newTemplate;
        } catch (error) {
          throw new Error(
            `Failed to import template: ${error instanceof Error ? error.message : 'Invalid JSON'}`
          );
        }
      },

      /**
       * Export a single template to JSON string
       */
      exportTemplate: (id) => {
        const template = get().userTemplates.find((t) => t.id === id);
        if (!template) {
          throw new Error(`Template with id "${id}" not found`);
        }

        return JSON.stringify(template, null, 2);
      },

      /**
       * Export all templates to JSON string
       */
      exportAllTemplates: () => {
        const templates = get().userTemplates;
        return JSON.stringify(templates, null, 2);
      },

      /**
       * Import multiple templates from JSON string
       * Replaces existing templates
       */
      importAllTemplates: (json) => {
        try {
          const parsed = JSON.parse(json);

          if (!Array.isArray(parsed)) {
            throw new Error('Invalid format: expected array of templates');
          }

          // Validate and regenerate IDs to avoid conflicts
          const templates: UserTemplate[] = parsed.map((t) => {
            if (!t.name || !t.config) {
              throw new Error('Invalid template format: missing name or config');
            }

            return {
              id: nanoid(),
              name: t.name,
              description: t.description || '',
              createdAt: t.createdAt || new Date().toISOString(),
              config: t.config,
            };
          });

          set({ userTemplates: templates });
        } catch (error) {
          throw new Error(
            `Failed to import templates: ${error instanceof Error ? error.message : 'Invalid JSON'}`
          );
        }
      },

      /**
       * Update template metadata (name, description, or config)
       */
      updateTemplate: (id, updates) => {
        set((state) => ({
          userTemplates: state.userTemplates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      /**
       * Duplicate an existing template
       */
      duplicateTemplate: (id, newName) => {
        const template = get().userTemplates.find((t) => t.id === id);
        if (!template) {
          throw new Error(`Template with id "${id}" not found`);
        }

        const duplicated: UserTemplate = {
          id: nanoid(),
          name: newName || `${template.name} (Copy)`,
          description: template.description,
          createdAt: new Date().toISOString(),
          config: { ...template.config },
        };

        set((state) => ({
          userTemplates: [...state.userTemplates, duplicated],
        }));

        return duplicated;
      },

      /**
       * Clear all templates (with confirmation)
       */
      clearAllTemplates: () => {
        set({ userTemplates: [] });
      },
    }),
    {
      name: 'opencode-templates-storage',
      version: 1,
    }
  )
);

/**
 * Selector hooks for better performance
 */
export const useTemplates = () => useTemplateStore((state) => state.userTemplates);
export const useTemplateActions = () =>
  useTemplateStore((state) => ({
    saveAsTemplate: state.saveAsTemplate,
    deleteTemplate: state.deleteTemplate,
    importTemplate: state.importTemplate,
    exportTemplate: state.exportTemplate,
    exportAllTemplates: state.exportAllTemplates,
    importAllTemplates: state.importAllTemplates,
    updateTemplate: state.updateTemplate,
    duplicateTemplate: state.duplicateTemplate,
    clearAllTemplates: state.clearAllTemplates,
  }));

/**
 * Get a single template by ID
 */
export const useTemplate = (id: string) =>
  useTemplateStore((state) => state.userTemplates.find((t) => t.id === id));

/**
 * Get template count
 */
export const useTemplateCount = () =>
  useTemplateStore((state) => state.userTemplates.length);

/**
 * Search templates by name or description
 */
export const useSearchTemplates = (query: string) =>
  useTemplateStore((state) => {
    if (!query.trim()) return state.userTemplates;

    const lowerQuery = query.toLowerCase();
    return state.userTemplates.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery)
    );
  });

/**
 * Return type for the main hook
 */
export interface UseTemplatesReturn {
  userTemplates: UserTemplate[];
  saveAsTemplate: (name: string, description: string, config: OpenCodeConfig) => void;
  deleteTemplate: (id: string) => void;
  importTemplate: (json: string) => UserTemplate;
  exportTemplate: (id: string) => string;
  exportAllTemplates: () => string;
  importAllTemplates: (json: string) => void;
  updateTemplate: (id: string, updates: Partial<Omit<UserTemplate, 'id' | 'createdAt'>>) => void;
  duplicateTemplate: (id: string, newName?: string) => UserTemplate;
  clearAllTemplates: () => void;
}

/**
 * Main hook that returns all template state and actions
 */
export const useTemplatesHook = (): UseTemplatesReturn => {
  const userTemplates = useTemplates();
  const actions = useTemplateActions();

  return {
    userTemplates,
    ...actions,
  };
};
