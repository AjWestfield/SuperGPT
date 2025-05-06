export type ArtifactKind = 'image' | 'text' | 'code';

export type ArtifactStatus = 'pending' | 'streaming' | 'complete' | 'error';

export interface Artifact {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  versions?: ArtifactVersion[];
  status: ArtifactStatus;
}

export interface ArtifactVersion {
  id: string;
  artifactId: string;
  content: string;
  createdAt: Date;
  description?: string;
}

export interface ImageDelta {
  type: 'image-delta';
  content: string; // url or base64
}

export interface TextDelta {
  type: 'text-delta';
  content: string;
}

export interface CodeDelta {
  type: 'code-delta';
  content: string;
  language?: string;
}

export type ArtifactDelta = ImageDelta | TextDelta | CodeDelta;